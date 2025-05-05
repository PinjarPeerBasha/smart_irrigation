package com.irrigation.backend.model.mapper;

import com.irrigation.backend.model.entity.AlertEntity;
import org.springframework.stereotype.Component;
import com.irrigation.backend.model.dtos.Alert;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AlertMapper {

    public Alert toDTO(AlertEntity alert) {
        if (alert == null) return null;

        return new Alert(
                alert.getId(),
                alert.getTitle(),
                alert.getMessage(),
                alert.getSeverity(),
                alert.getTimestamp(),
                alert.getSource(),
                alert.getFarmId(),
                alert.getZoneId(),
                alert.getIsRead(),
                alert.getIsResolved(),
                alert.getResolvedTime(),
                alert.getResolvedBy(),
                alert.getIsNotificationSent()
        );
    }

    public AlertEntity toEntity(Alert dto) {
        if (dto == null) return null;

        return new AlertEntity(
                dto.getId(),
                dto.getTitle(),
                dto.getMessage(),
                dto.getSeverity(),
                dto.getTimestamp(),
                dto.getSource(),
                dto.getFarmId(),
                dto.getZoneId(),
                dto.getIsRead(),
                dto.getIsResolved(),
                dto.getResolvedTime(),
                dto.getResolvedBy(),
                dto.getIsNotificationSent()
        );
    }

    public List<Alert> toDTOList(List<AlertEntity> alerts) {
        return alerts.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<AlertEntity> toEntityList(List<Alert> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
