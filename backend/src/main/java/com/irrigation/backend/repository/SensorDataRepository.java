package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.SensorDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorDataEntity, Long> {

    List<SensorDataEntity> findBySensorId(String sensorId);
    
    List<SensorDataEntity> findBySensorType(String sensorType);
    
    List<SensorDataEntity> findByLocation(String location);
    
    List<SensorDataEntity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT s FROM SensorDataEntity s WHERE s.sensorType = ?1 AND s.timestamp BETWEEN ?2 AND ?3")
    List<SensorDataEntity> findSensorDataByTypeAndTimeRange(String sensorType, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT AVG(s.value) FROM SensorDataEntity s WHERE s.sensorType = ?1 AND s.timestamp BETWEEN ?2 AND ?3")
    Double findAverageValueByTypeAndTimeRange(String sensorType, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT s FROM SensorDataEntity s WHERE s.sensorType = ?1 ORDER BY s.timestamp DESC LIMIT 1")
    SensorDataEntity findLatestByType(String sensorType);
} 