package com.irrigation.backend.model.mapper;


import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ZoneMapper {

    @Autowired
    @Lazy
    private final FarmMapper farmMapper;

    @Autowired
    @Lazy
    private final IrrigationDeviceMapper irrigationDeviceMapper;

    @Autowired
    @Lazy
    private final SensorDataMapper sensorDataMapper;


    public Zone toDTO(ZoneEntity zone) {
        if (zone == null) return null;

        return new Zone(
                zone.getId(),
                zone.getName(),
                zone.getArea(),
                zone.getCropType(),
                zone.getSoilType(),
                zone.getFarmId(),
                zone.getMoistureThreshold(),
                zone.getWateringDuration(),
               new Farm(),
                new ArrayList<>(),
                new ArrayList<>()
        );
    }

    public ZoneEntity toEntity(Zone dto) {
        if (dto == null) return null;

        return new ZoneEntity(
                dto.getId(),
                dto.getName(),
                dto.getArea(),
                dto.getCropType(),
                dto.getSoilType(),
                dto.getFarm().getId(),
                dto.getMoistureThreshold(),
                dto.getWateringDuration()
        );
    }

    public List<Zone> toDTOList(List<ZoneEntity> zones) {
        return zones.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ZoneEntity> toEntityList(List<Zone> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
