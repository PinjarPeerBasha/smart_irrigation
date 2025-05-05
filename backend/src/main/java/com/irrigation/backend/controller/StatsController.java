// src/main/java/com/example/demo/controller/StatsController.java
package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.Stats;
import com.irrigation.backend.service.SensorDataService;
import com.irrigation.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Stats> getDashboardStats() {
        try {
            System.out.println("getDashBoardStats -  Enter " );

            Stats stats =  statsService.getDashboardStats();

            System.out.println("getDashBoardStats -  Exist  " + stats);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
