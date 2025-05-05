package com.irrigation.backend.model.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Farm {
    private Long id;
    private String name;
    private String location;
    private Double size;
    private String cropType;
    private String soilType;
    private List<Zone> zones = new ArrayList<Zone>();
    private List<IrrigationSchedule> schedules = new ArrayList<IrrigationSchedule>();
}
