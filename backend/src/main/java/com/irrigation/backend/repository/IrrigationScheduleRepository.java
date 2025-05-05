package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IrrigationScheduleRepository extends JpaRepository<IrrigationScheduleEntity, Long> {
    
    List<IrrigationScheduleEntity> findByFarmId(Long farmId);
    
    List<IrrigationScheduleEntity> findByZoneId(Long zoneId);
    
    List<IrrigationScheduleEntity> findByStatus(String status);
    
    List<IrrigationScheduleEntity> findByIsRecurring(Boolean isRecurring);
    
    List<IrrigationScheduleEntity> findByIsAutomated(Boolean isAutomated);
    
    List<IrrigationScheduleEntity> findByScheduledStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<IrrigationScheduleEntity> findByCompletedTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<IrrigationScheduleEntity> findByScheduledStartTimeAfterAndStatus(LocalDateTime time, String status);

    List<IrrigationScheduleEntity> findByScheduledStartTimeBeforeAndStatus(LocalDateTime time, String status);

} 