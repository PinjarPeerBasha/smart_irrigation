package com.irrigation.backend.model.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zone {
    private Long id;
    private String name;
    private Double area;
    private String cropType;
    private String soilType;
    private Long farmId;
    private Double moistureThreshold;
    private Double wateringDuration;
    private Farm farm;
    private List<IrrigationDevice> irrigationDevices = new ArrayList<>();
    private List<SensorData> sensorData = new ArrayList<>();
}
