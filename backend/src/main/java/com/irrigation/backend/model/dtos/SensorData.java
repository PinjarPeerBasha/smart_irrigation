package com.irrigation.backend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorData {
    private Long id;
    private String deviceId;
    private String sensorId;
    private String sensorType;
    private Double value;
    private String unit;
    private String location;
    private LocalDateTime timestamp;
    private Double batteryLevel;
    private Integer signalStrength;
    private Long zoneId;
    private Zone zone;
}
