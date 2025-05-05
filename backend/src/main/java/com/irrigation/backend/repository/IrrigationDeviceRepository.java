package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.IrrigationDeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IrrigationDeviceRepository extends JpaRepository<IrrigationDeviceEntity, Long> {
    
    List<IrrigationDeviceEntity> findByZoneId(Long zoneId);
    
    //List<IrrigationDeviceEntity> findByZoneFarmId(Long farmId);
    
    List<IrrigationDeviceEntity> findByType(String type);
    
    List<IrrigationDeviceEntity> findByStatus(String status);
    
    Optional<IrrigationDeviceEntity> findByDeviceId(String deviceId);
    
    List<IrrigationDeviceEntity> findByIsActive(Boolean isActive);
    
    List<IrrigationDeviceEntity> findByLastWateringTimeBetween(LocalDateTime start, LocalDateTime end);
} 