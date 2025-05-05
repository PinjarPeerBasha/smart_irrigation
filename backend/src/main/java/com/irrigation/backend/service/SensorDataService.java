package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.SensorData;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.SensorDataEntity;
import com.irrigation.backend.model.mapper.SensorDataMapper;
import com.irrigation.backend.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class SensorDataService {

    private final SensorDataRepository sensorDataRepository;
    private final SensorDataMapper sensorDataMapper;

    public SensorData saveSensorData(SensorData sensorData) {
        if (sensorData.getTimestamp() == null) {
            sensorData.setTimestamp(LocalDateTime.now());
        }
        return sensorDataMapper.toDTO(sensorDataRepository.save(sensorDataMapper.toEntity(sensorData)));
    }
    
    public List<SensorData> getAllSensorData() {
        return sensorDataMapper.toDTOList(sensorDataRepository.findAll());
    }
    
    public Optional<SensorData> getSensorDataById(Long id) {

        Optional<SensorDataEntity> sensorEntity = sensorDataRepository.findById(id);

        if (sensorEntity.isEmpty()) return Optional.empty();


        return Optional.of(sensorDataMapper.toDTO(sensorEntity.get()));
    }
    
    public List<SensorData> getSensorDataByType(String sensorType) {
        return sensorDataMapper.toDTOList(sensorDataRepository.findBySensorType(sensorType));
    }
    
    public List<SensorData> getSensorDataByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return sensorDataMapper.toDTOList(sensorDataRepository.findByTimestampBetween(startTime, endTime));
    }
    
    public List<SensorData> getSensorDataByTypeAndTimeRange(String sensorType, LocalDateTime startTime, LocalDateTime endTime) {
        return sensorDataMapper.toDTOList(sensorDataRepository.findSensorDataByTypeAndTimeRange(sensorType, startTime, endTime));
    }
    
    public Double getAverageValueByTypeAndTimeRange(String sensorType, LocalDateTime startTime, LocalDateTime endTime) {
        return sensorDataRepository.findAverageValueByTypeAndTimeRange(sensorType, startTime, endTime);
    }
    
    public SensorData getLatestByType(String sensorType) {
        return sensorDataMapper.toDTO(sensorDataRepository.findLatestByType(sensorType));
    }
    
    public Map<String, Object> getLatestReadings() {
        Map<String, Object> latestReadings = new HashMap<>();
        
        // Get latest soil moisture
        SensorData soilMoisture = getLatestByType("soil_moisture");
        if (soilMoisture != null) {
            latestReadings.put("soil_moisture", soilMoisture);
        }
        
        // Get latest temperature
        SensorData temperature = getLatestByType("temperature");
        if (temperature != null) {
            latestReadings.put("temperature", temperature);
        }
        
        // Get latest humidity
        SensorData humidity = getLatestByType("humidity");
        if (humidity != null) {
            latestReadings.put("humidity", humidity);
        }
        
        // Get latest rainfall
        SensorData rainfall = getLatestByType("rainfall");
        if (rainfall != null) {
            latestReadings.put("rainfall", rainfall);
        }
        
        return latestReadings;
    }
} 