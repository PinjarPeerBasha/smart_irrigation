package com.irrigation.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irrigation.backend.model.entity.IrrigationDeviceEntity;
import com.irrigation.backend.model.entity.SensorDataEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.repository.IrrigationDeviceRepository;
import com.irrigation.backend.repository.SensorDataRepository;
import com.irrigation.backend.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class MqttMessageHandler implements MessageHandler {

    private final SensorDataRepository sensorDataRepository;
    private final ZoneRepository zoneRepository;
    private final AlertService alertService;
    private final ObjectMapper objectMapper;
    private final IrrigationDeviceRepository irrigationDeviceRepository;
    private final MqttSenderService mqttSenderService;
    @Value("${mqtt.topic.sensor-data}")
    private String sensorDataTopic;

    @Override
    public void handleMessage(Message<?> message) throws MessagingException {
        try {
            String topic = message.getHeaders().get("mqtt_receivedTopic").toString();
            String payload = message.getPayload().toString();

            log.info("Received MQTT message: Topic={}, Payload={}", topic, payload);
            System.out.println ("Received MQTT message: Topic=" + topic + ", Payload=" + payload);

            if (!topic.contains(sensorDataTopic.substring(0, sensorDataTopic.lastIndexOf("/")))) {
                log.info("Ignoring message from topic={}", topic);
           }

            //mqttSenderService.send("sending Acknowldgetment");

            // Parse the sensorId from the topic
            // Example topic: irrigation/sensors/soil-moisture-1
            String sensorId = topic.substring(topic.lastIndexOf('/') + 1);
            
            // Parse the JSON payload
            SensorDataEntity sensorData = objectMapper.readValue(payload, SensorDataEntity.class);


            IrrigationDeviceEntity irrigationDeviceEntity = irrigationDeviceRepository
                    .findByDeviceId(sensorData.getDeviceId())
                    .orElse(null);

            if (irrigationDeviceEntity == null || (irrigationDeviceEntity.getIsActive() != null && !irrigationDeviceEntity.getIsActive())) {

                log.error("Ignoring MQTT message: Topic={}, Payload={} as there is no matching device present in the system or Device is not active", topic, payload);

                return;
            }

            // Set additional fields
            sensorData.setSensorId(sensorId);
            sensorData.setTimestamp(LocalDateTime.now());
            sensorData.setZoneId(irrigationDeviceEntity.getZoneId());
            
            // Save to the database
            sensorDataRepository.save(sensorData);
            
            // Check for any thresholds to trigger alerts
            checkThresholds(sensorData, irrigationDeviceEntity);
            
        } catch (Exception e) {
            log.error("Error processing MQTT message", e);
        }
    }
    
    private void checkThresholds(SensorDataEntity sensorData, IrrigationDeviceEntity irrigationDeviceEntity) {


        ZoneEntity zoneEntity = zoneRepository.findById(irrigationDeviceEntity.getZoneId())
                .orElse(null);
        String zoneName = Long.toString(irrigationDeviceEntity.getZoneId());
        if (zoneEntity != null ) {

            zoneName = zoneEntity.getName();

        }

        // Example: Check soil moisture threshold
        if ("soil_moisture".equals(sensorData.getSensorType()) && sensorData.getValue() < 20.0) {
            alertService.createAlert(
                "Low Soil Moisture",
                "Soil moisture level is critically low (" + sensorData.getValue() + "%) for sensor id " + sensorData.getSensorId() + " Device Name " + irrigationDeviceEntity.getName() + " Zone " + zoneName,
                "WARNING",
                sensorData.getSensorId()
            );
        }
        
        // Example: Check temperature threshold
        if ("temperature".equals(sensorData.getSensorType()) && sensorData.getValue() > 35.0) {
            alertService.createAlert(
                "High Temperature",
                "Temperature is critically high (" + sensorData.getValue() + "%) for sensor id " + sensorData.getSensorId() + " Device Name : " + irrigationDeviceEntity.getName() + " Zone : " + zoneName,
                "WARNING",
                sensorData.getSensorId()
            );
        }

 /*       // Example: Check temperature threshold
        if ("humidity".equals(sensorData.getSensorType()) && sensorData.getValue() > 35.0) {
            alertService.createAlert(
                    "High Temperature",
                    "Temperature is critically high (" + sensorData.getValue() + "%) for sensor id " + sensorData.getSensorId() + " Device Name " + irrigationDeviceEntity.getName() + " Zone " + irrigationDeviceEntity.getZoneId(),
                    "WARNING",
                    sensorData.getSensorId()
            );
        }*/
    }
} 