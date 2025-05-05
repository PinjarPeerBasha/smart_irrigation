package com.irrigation.backend.model.mapper;

import com.irrigation.backend.model.dtos.SensorData;
import com.irrigation.backend.model.entity.SensorDataEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SensorDataMapper {

    public SensorData toDTO(SensorDataEntity sensorData) {
        if (sensorData == null) return null;

        return new SensorData(
                sensorData.getId(),
                sensorData.getDeviceId(),
                sensorData.getSensorId(),
                sensorData.getSensorType(),
                sensorData.getValue(),
                sensorData.getUnit(),
                sensorData.getLocation(),
                sensorData.getTimestamp(),
                sensorData.getBatteryLevel(),
                sensorData.getSignalStrength(),
                sensorData.getZoneId(),
                null
        );
    }

    public SensorDataEntity toEntity(SensorData dto) {
        if (dto == null) return null;

        return new SensorDataEntity(
                dto.getId(),
                dto.getDeviceId(),
                dto.getSensorId(),
                dto.getSensorType(),
                dto.getValue(),
                dto.getUnit(),
                dto.getLocation(),
                dto.getTimestamp(),
                dto.getBatteryLevel(),
                dto.getSignalStrength(),
                dto.getZoneId()


        );
    }

    public List<SensorData> toDTOList(List<SensorDataEntity> dataList) {
        return dataList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<SensorDataEntity> toEntityList(List<SensorData> dtoList) {
        return dtoList.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
