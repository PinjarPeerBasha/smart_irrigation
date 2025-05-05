package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.SensorData;
import com.irrigation.backend.service.SensorDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sensor-data")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SensorDataController {

    private final SensorDataService sensorDataService;

    @GetMapping
    public ResponseEntity<List<SensorData>> getAllSensorData() {
        return ResponseEntity.ok(sensorDataService.getAllSensorData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SensorData> getSensorDataById(@PathVariable Long id) {
        return ResponseEntity.ok(sensorDataService.getSensorDataById(id)
                .orElseThrow(() -> new RuntimeException("Sensor data not found with id: " + id)));
    }

    @GetMapping("/type/{sensorType}")
    public ResponseEntity<List<SensorData>> getSensorDataByType(@PathVariable String sensorType) {
        return ResponseEntity.ok(sensorDataService.getSensorDataByType(sensorType));
    }

    @GetMapping("/range")
    public ResponseEntity<List<SensorData>> getSensorDataByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(sensorDataService.getSensorDataByTimeRange(startTime, endTime));
    }

    @GetMapping("/type/{sensorType}/range")
    public ResponseEntity<List<SensorData>> getSensorDataByTypeAndTimeRange(
            @PathVariable String sensorType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(sensorDataService.getSensorDataByTypeAndTimeRange(sensorType, startTime, endTime));
    }

    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> getLatestReadings() {
        return ResponseEntity.ok(sensorDataService.getLatestReadings());
    }

    @PostMapping
    public ResponseEntity<SensorData> createSensorData(@RequestBody SensorData sensorData) {
        return ResponseEntity.ok(sensorDataService.saveSensorData(sensorData));
    }
} 