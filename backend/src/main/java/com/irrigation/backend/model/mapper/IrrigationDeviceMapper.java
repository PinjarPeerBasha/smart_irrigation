package com.irrigation.backend.model.mapper;


import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.dtos.IrrigationDevice;
import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationDeviceEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class IrrigationDeviceMapper {

    @Autowired
    @Lazy
    private ZoneMapper zoneMapper;

    public IrrigationDevice toDTO(IrrigationDeviceEntity device) {
        if (device == null) return null;

        return new IrrigationDevice(
                device.getId(),
                device.getDeviceId(),
                device.getName(),
                device.getType(),
                device.getStatus(),
                device.getIsActive(),
                device.getFlowRate(),
                device.getLastWateringDuration(),
                device.getLastWateringTime(),
                device.getZoneId(),
                new Zone()
        );
    }




    public IrrigationDeviceEntity toEntity(IrrigationDevice dto) {
        if (dto == null) return null;

        return new IrrigationDeviceEntity(
                dto.getId(),
                dto.getDeviceId(),
                dto.getName(),
                dto.getType(),
                dto.getStatus(),
                dto.getIsActive(),
                dto.getFlowRate(),
                dto.getLastWateringDuration(),
                dto.getLastWateringTime(),
                dto.getZoneId()
        );
    }


    public List<IrrigationDevice> toDTOList(List<IrrigationDeviceEntity> devices) {
        return devices.stream().map(Zone -> toDTO(Zone)).collect(Collectors.toList());
    }

    public List<IrrigationDeviceEntity> toEntityList(List<IrrigationDevice> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
