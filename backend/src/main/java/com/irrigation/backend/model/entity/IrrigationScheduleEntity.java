package com.irrigation.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "irrigation_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IrrigationScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "schedule_name", nullable = false)
    private String scheduleName;

    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    @Column(name = "zone_id", nullable = false)
    private Long zoneId;

    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column
    private Boolean isRecurring = false;

    @Column
    private String recurringDays; // e.g., "MON,WED,FRI"

    @Column
    private LocalTime recurringTime;

    @Column
    private String status; // scheduled, completed, cancelled

    @Column
    private Boolean isAutomated = false;

    @Column
    private LocalDateTime completedTime;

    @Column
    private Double waterUsed; // in liters
}
