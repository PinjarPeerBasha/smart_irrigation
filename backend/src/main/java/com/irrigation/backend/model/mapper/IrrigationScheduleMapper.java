package com.irrigation.backend.model.mapper;

import com.irrigation.backend.model.dtos.IrrigationSchedule;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IrrigationScheduleMapper {

    public IrrigationSchedule toDTO(IrrigationScheduleEntity entity) {
        if (entity == null) return null;

        IrrigationSchedule dto = new IrrigationSchedule();
        dto.setId(entity.getId());
        dto.setFarmId(entity.getFarmId());
        dto.setName(entity.getScheduleName());
        dto.setZoneId(entity.getZoneId());
        dto.setScheduledStartTime(entity.getScheduledStartTime());
        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setIsRecurring(entity.getIsRecurring());
        dto.setRecurringDays(entity.getRecurringDays());
        dto.setRecurringTime(entity.getRecurringTime());
        dto.setStatus(entity.getStatus());
        dto.setIsAutomated(entity.getIsAutomated());
        dto.setCompletedTime(entity.getCompletedTime());
        dto.setWaterUsed(entity.getWaterUsed());

        return dto;
    }

    public IrrigationScheduleEntity toEntity(IrrigationSchedule dto) {
        if (dto == null) return null;

        IrrigationScheduleEntity entity = new IrrigationScheduleEntity();
        entity.setId(dto.getId());
        entity.setFarmId(dto.getFarmId());
        entity.setScheduleName(dto.getName());
        entity.setZoneId(dto.getZoneId());
        entity.setScheduledStartTime(dto.getScheduledStartTime());
        entity.setDurationMinutes(dto.getDurationMinutes());
        entity.setIsRecurring(dto.getIsRecurring());
        entity.setRecurringDays(dto.getRecurringDays());
        entity.setRecurringTime(dto.getRecurringTime());
        entity.setStatus(dto.getStatus());
        entity.setIsAutomated(dto.getIsAutomated());
        entity.setCompletedTime(dto.getCompletedTime());
        entity.setWaterUsed(dto.getWaterUsed());

        return entity;
    }

    public List<IrrigationSchedule> toDTOList(List<IrrigationScheduleEntity> entities) {
        if (entities == null || entities.isEmpty()) return List.of();
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<IrrigationScheduleEntity> toEntityList(List<IrrigationSchedule> dtos) {
        if (dtos == null || dtos.isEmpty()) return List.of();
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
