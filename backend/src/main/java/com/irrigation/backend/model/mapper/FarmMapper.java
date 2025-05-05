package com.irrigation.backend.model.mapper;

import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FarmMapper {

    @Autowired
    @Lazy
    private ZoneMapper zoneMapper;

    @Autowired
    @Lazy
    private IrrigationScheduleMapper irrigationScheduleMapper;

    public Farm toDTO(FarmEntity farm, List<ZoneEntity> zones, List<IrrigationScheduleEntity> irrigationScheduleEntities) {
        if (farm == null) return null;

        return new Farm(
                farm.getId(),
                farm.getName(),
                farm.getLocation(),
                farm.getSize(),
                farm.getCropType(),
                farm.getSoilType(),
                zoneMapper.toDTOList(zones),
                irrigationScheduleMapper.toDTOList(irrigationScheduleEntities)
        );
    }

    public FarmEntity toEntity(Farm dto) {
        if (dto == null) return null;

        return new FarmEntity(
                dto.getId(),
                dto.getName(),
                dto.getLocation(),
                dto.getSize(),
                dto.getCropType(),
                dto.getSoilType()
        );
    }

    public List<Farm> toDTOList(List<FarmEntity> farms) {
        return farms.stream().map(farm -> toDTO(farm, null, null)).collect(Collectors.toList());
    }

    public List<FarmEntity> toEntityList(List<Farm> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
