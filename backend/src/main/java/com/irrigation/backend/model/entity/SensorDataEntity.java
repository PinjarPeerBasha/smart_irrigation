package com.irrigation.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false)
    private String deviceId;

    @Column(nullable = false)
    private String sensorId;

    @Column(name = "sensor_type")
    private String sensorType; // e.g., soil_moisture, temperature, etc.

    @Column(name = "value", nullable = false)
    private Double value;

    @Column(name = "unit")
    private String unit;

    @Column(name = "location")
    private String location;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "battery_level")
    private Double batteryLevel;

    @Column(name = "signal_strength")
    private Integer signalStrength;

    @Column(name = "zone_id")
    private Long zoneId;
}
