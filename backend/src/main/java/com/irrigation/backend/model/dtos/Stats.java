// src/main/java/com/example/demo/dto/StatsDTO.java
package com.irrigation.backend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stats {
    private int activeDevices=0;
    private int totalDevices=0;
    private Double waterUsageToday= Double.NaN;
    private int waterChangePercent=0;
    private int scheduledCount=0;
    private int nextSchedule=0;
}
