package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, Long> {
    
    List<AlertEntity> findBySeverity(String severity);
    
    List<AlertEntity> findByFarmId(Long farmId);
    
    List<AlertEntity> findByZoneId(Long zoneId);
    
    List<AlertEntity> findBySource(String source);
    
    List<AlertEntity> findByIsRead(Boolean isRead);
    
    List<AlertEntity> findByIsResolved(Boolean isResolved);
    
    List<AlertEntity> findByIsNotificationSent(Boolean isNotificationSent);
    
    List<AlertEntity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    List<AlertEntity> findByFarmIdAndIsReadOrderByTimestampDesc(Long farmId, Boolean isRead);
} 