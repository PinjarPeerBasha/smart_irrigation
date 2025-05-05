package com.irrigation.backend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    private Long id;
    private String title;
    private String message;
    private String severity;
    private LocalDateTime timestamp;
    private String source;
    private Long farmId;
    private Long zoneId;
    private Boolean isRead;
    private Boolean isResolved;
    private LocalDateTime resolvedTime;
    private String resolvedBy;
    private Boolean isNotificationSent;
}
