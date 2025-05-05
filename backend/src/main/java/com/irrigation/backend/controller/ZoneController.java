package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.service.ZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/zones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ZoneController {

    private final ZoneService zoneService;

    @GetMapping
    public ResponseEntity<List<Zone>> getAllZones(@RequestParam(required = false) Long farmId) {
        if (farmId != null) {
            return ResponseEntity.ok(zoneService.getZonesByFarm(farmId));
        }
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Zone> getZoneById(@PathVariable Long id) {
        return ResponseEntity.ok(zoneService.getZoneById(id)
                .orElseThrow(() -> new RuntimeException("Zone not found with id: " + id)));
    }

    @PostMapping
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) {
        return ResponseEntity.ok(zoneService.saveZone(zone));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Zone> updateZone(@PathVariable Long id, @RequestBody Zone zone) {
        zone.setId(id);
        return ResponseEntity.ok(zoneService.saveZone(zone));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        zoneService.deleteZone(id);
        return ResponseEntity.noContent().build();
    }
} 