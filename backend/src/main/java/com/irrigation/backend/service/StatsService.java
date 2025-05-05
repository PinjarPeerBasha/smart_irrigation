// src/main/java/com/example/demo/service/impl/StatsServiceImpl.java
package com.irrigation.backend.service;


import com.irrigation.backend.model.dtos.IrrigationDevice;
import com.irrigation.backend.model.dtos.Stats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StatsService {


    @Autowired
    IrrigationDeviceService irrigationDeviceService;

    @Autowired
    IrrigationScheduleService irrigationScheduleService;

    public Stats getDashboardStats() {


        Stats stats = new Stats();
        int activeDevices = 0;

        List<IrrigationDevice> irrigationDeviceList = irrigationDeviceService.getAllDevices();

        for (IrrigationDevice irrigationDevice : irrigationDeviceList) {

            if (irrigationDevice.getIsActive()) activeDevices++;

        }

        stats.setActiveDevices(activeDevices);
        stats.setTotalDevices(irrigationDeviceList.size());

        irrigationScheduleService.getAllSchedules().forEach(schedule -> {
            boolean isToday = false;
            if (schedule.getCompletedTime() != null)
            isToday = schedule.getCompletedTime().toLocalDate().equals(LocalDate.now());

            if (isToday && schedule.getWaterUsed()!= null) {
                Double waterUsage = Double.sum(stats.getWaterUsageToday(), schedule.getWaterUsed());
                stats.setWaterUsageToday(waterUsage);
            };

            if  (schedule.getStatus()  != null && (schedule.getStatus().equalsIgnoreCase("active")  || schedule.getStatus().equalsIgnoreCase("scheduled"))) {
                stats.setScheduledCount(stats.getScheduledCount() + 1);
            }

            isToday = schedule.getScheduledStartTime().toLocalDate().equals(LocalDate.now());

            if (isToday) {
                stats.setNextSchedule(stats.getNextSchedule()+1);
            }
        });

        stats.setWaterChangePercent(calculateWaterChangePercent());

        return stats;
    }

    private int fetchActiveDevices() {
        return irrigationDeviceService.getDevicesByActiveStatus(true).size();
    }

    private int fetchTotalDevices() {
       return irrigationDeviceService.getAllDevices().size();
    }

    private int fetchWaterUsageToday() {
        return 45;
    }

    private int calculateWaterChangePercent() {
        return 26;
    }

    private int fetchScheduledCount() {
        return 55;
    }

    private int fetchNextSchedule() {
        return 5;
    }
}
