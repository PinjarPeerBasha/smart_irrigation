package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.IrrigationSchedule;
import com.irrigation.backend.service.IrrigationScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IrrigationScheduleController {

    private final IrrigationScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<IrrigationSchedule>> getSchedules(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long zoneId,
            @RequestParam(required = false) String status) {
        
        if (farmId != null && zoneId != null) {
            return ResponseEntity.ok(scheduleService.getSchedulesByFarmAndZone(farmId, zoneId));
        } else if (farmId != null) {
            return ResponseEntity.ok(scheduleService.getSchedulesByFarm(farmId));
        } else if (zoneId != null) {
            return ResponseEntity.ok(scheduleService.getSchedulesByZone(zoneId));
        } else if (status != null) {
            return ResponseEntity.ok(scheduleService.getSchedulesByStatus(status));
        }
        
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IrrigationSchedule> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id)));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<IrrigationSchedule>> getUpcomingSchedules() {
        return ResponseEntity.ok(scheduleService.getUpcomingSchedules());
    }

    @GetMapping("/range")
    public ResponseEntity<List<IrrigationSchedule>> getSchedulesInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(scheduleService.getSchedulesInTimeRange(startTime, endTime));
    }

    @PostMapping
    public ResponseEntity<IrrigationSchedule> createSchedule(@RequestBody IrrigationSchedule schedule) {

        System.out.println ("createSchedule " + schedule);
        return ResponseEntity.ok(scheduleService.saveSchedule(schedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IrrigationSchedule> updateSchedule(@PathVariable Long id, @RequestBody IrrigationSchedule schedule) {
        schedule.setId(id);
        return ResponseEntity.ok(scheduleService.saveSchedule(schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<IrrigationSchedule> executeSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.executeSchedule(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<IrrigationSchedule> cancelSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.cancelSchedule(id));
    }
} 