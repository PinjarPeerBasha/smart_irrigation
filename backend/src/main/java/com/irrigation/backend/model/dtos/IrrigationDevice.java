package com.irrigation.backend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IrrigationDevice {
    private Long id;
    private String deviceId;
    private String name;
    private String type;
    private String status;
    private Boolean isActive;
    private Double flowRate;
    private Double lastWateringDuration;
    private LocalDateTime lastWateringTime;
    private Long zoneId;
    private Zone zone;
}
