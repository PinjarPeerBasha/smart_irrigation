package com.irrigation.backend.model.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IrrigationSchedule {
    private Long id;
    private String name;
    private Long farmId;
    private Long zoneId;
    private LocalDateTime scheduledStartTime;
    private Integer durationMinutes;
    private Boolean isRecurring;
    private String recurringDays;
    private LocalTime recurringTime;
    private String status;
    private Boolean isAutomated;
    private LocalDateTime completedTime;
    private Double waterUsed;
    private Farm farm;
    private Zone zone;
}
