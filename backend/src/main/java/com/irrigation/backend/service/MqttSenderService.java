package com.irrigation.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.stereotype.Service;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.Message;
import org.springframework.integration.mqtt.support.MqttHeaders;


@Service
@RequiredArgsConstructor
public class MqttSenderService {


    @Value("${mqtt.topic.sensor-operation}")
    private String sensorOperation; // Add the acknowledgment topic property


    private final MessageChannel mqttOutboundChannel;  // The outbound channel for sending messages

    public void send(String message) {
        Message<String> msg = MessageBuilder.withPayload(message)
                .setHeader(MqttHeaders.TOPIC, sensorOperation)
                .build();
        mqttOutboundChannel.send(msg);
    }
}