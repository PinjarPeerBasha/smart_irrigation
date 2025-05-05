package com.irrigation.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String severity; // INFO, WARNING, CRITICAL

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column
    private String source; // sensor ID, device ID, or system

    // Replacing JPA relationships with just foreign key fields
    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "zone_id")
    private Long zoneId;

    @Column
    private Boolean isRead = false;

    @Column
    private Boolean isResolved = false;

    @Column
    private LocalDateTime resolvedTime;

    @Column
    private String resolvedBy;

    @Column
    private Boolean isNotificationSent = false;
}
