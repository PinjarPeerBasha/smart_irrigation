package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.Alert;
import com.irrigation.backend.model.entity.AlertEntity;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.model.mapper.AlertMapper;
import com.irrigation.backend.repository.AlertRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final NotificationService notificationService;

    private final AlertMapper alertMapper;

    public List<Alert> getAllAlerts() {

        List<AlertEntity> alertEntities = alertRepository.findAll();

        return alertEntities.stream().map(alertMapper::toDTO).collect(Collectors.toList());
    }
    
    public Optional<Alert> getAlertById(Long id) {

        Optional<AlertEntity> alertEntity = alertRepository.findById(id);

        return alertEntity.map(alertMapper::toDTO);

    }

    public Alert createAlert(String title, String message, String severity, String source) {
        AlertEntity alert = new AlertEntity();
        alert.setTitle(title);
        alert.setMessage(message);
        alert.setSeverity(severity);
        alert.setTimestamp(LocalDateTime.now());
        alert.setSource(source);
        alert.setIsRead(false);
        alert.setIsResolved(false);
        alert.setIsNotificationSent(false);
        
        alert = alertRepository.save(alert);
        
        // Send notification based on alert severity
        if ("CRITICAL".equals(severity) || "WARNING".equals(severity)) {
            try {
                notificationService.sendNotification(title, message, severity);
                alert.setIsNotificationSent(true);
                alert = alertRepository.save(alert);
            } catch (Exception e) {
                log.error("Failed to send notification for alert: {}", alert.getId(), e);
            }
        }
        
        return alertMapper.toDTO(alert);
    }
    
    public List<Alert> getUnreadAlerts() {
        return alertMapper.toDTOList(alertRepository.findByIsRead(false));
    }
    
    public List<Alert> getAlertsByFarm(Long farmId) {
        return alertMapper.toDTOList(alertRepository.findByFarmId(farmId));
    }
    
    public List<Alert> getAlertsByZone(Long zoneId) {
        return alertMapper.toDTOList(alertRepository.findByZoneId(zoneId));
    }
    
    public List<Alert> getUnresolvedAlerts() {
        return alertMapper.toDTOList(alertRepository.findByIsResolved(false));
    }
    
    public List<Alert> getAlertsBySeverity(String severity) {
        return alertMapper.toDTOList(alertRepository.findBySeverity(severity));
    }
    
    public List<Alert> getAlertsByReadStatus(Boolean isRead) {
        return alertMapper.toDTOList(alertRepository.findByIsRead(isRead));
    }
    
    public List<Alert> getAlertsByResolvedStatus(Boolean isResolved) {
        return alertMapper.toDTOList(alertRepository.findByIsResolved(isResolved));
    }
    
    public List<Alert> getAlertsByFarmAndReadStatus(Long farmId, Boolean isRead) {
        return alertMapper.toDTOList(alertRepository.findByFarmIdAndIsReadOrderByTimestampDesc(farmId, isRead));
    }
    
    public Alert markAsRead(Long alertId) {
        AlertEntity alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new EntityNotFoundException("Alert not found with id: " + alertId));
        alert.setIsRead(true);
        return alertMapper.toDTO(alertRepository.save(alert));
    }
    
    public Alert markAsResolved(Long alertId, String resolvedBy) {
        AlertEntity alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new EntityNotFoundException("Alert not found with id: " + alertId));
        alert.setIsResolved(true);
        alert.setResolvedTime(LocalDateTime.now());
        alert.setResolvedBy(resolvedBy);
        return alertMapper.toDTO(alertRepository.save(alert));
    }
} 