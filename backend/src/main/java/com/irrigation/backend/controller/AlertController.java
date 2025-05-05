package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.Alert;
import com.irrigation.backend.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getAlerts(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long zoneId,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Boolean isResolved) {
        
        if (farmId != null && isRead != null) {
            return ResponseEntity.ok(alertService.getAlertsByFarmAndReadStatus(farmId, isRead));
        } else if (farmId != null) {
            return ResponseEntity.ok(alertService.getAlertsByFarm(farmId));
        } else if (zoneId != null) {
            return ResponseEntity.ok(alertService.getAlertsByZone(zoneId));
        } else if (severity != null) {
            return ResponseEntity.ok(alertService.getAlertsBySeverity(severity));
        } else if (isRead != null) {
            return ResponseEntity.ok(alertService.getAlertsByReadStatus(isRead));
        } else if (isResolved != null) {
            return ResponseEntity.ok(alertService.getAlertsByResolvedStatus(isResolved));
        }
        
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlertById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id)));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Alert>> getUnreadAlerts() {
        return ResponseEntity.ok(alertService.getUnreadAlerts());
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<Alert>> getUnresolvedAlerts() {
        return ResponseEntity.ok(alertService.getUnresolvedAlerts());
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        return ResponseEntity.ok(alertService.createAlert(
                alert.getTitle(),
                alert.getMessage(),
                alert.getSeverity(),
                alert.getSource()
        ));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Alert> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> markAsResolved(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String resolvedBy = request.get("resolvedBy");
        return ResponseEntity.ok(alertService.markAsResolved(id, resolvedBy));
    }
} 