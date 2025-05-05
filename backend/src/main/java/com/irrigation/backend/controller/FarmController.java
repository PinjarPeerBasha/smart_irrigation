package com.irrigation.backend.controller;


import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.mapper.FarmMapper;
import com.irrigation.backend.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FarmController {

    private final FarmService farmService;
    private final FarmMapper farmMapper;

    @GetMapping
    public ResponseEntity<List<Farm>> getAllFarms() {

        System.out.println("getAllFarms called from frontend");

        return ResponseEntity.ok(farmService.getAllFarms());



    }

    @GetMapping("/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {

        System.out.println("getAllFarmById called from frontend");

        return ResponseEntity.ok(farmService.getFarmById(id)
                .orElseThrow(() -> new RuntimeException("Farm not found with id: " + id)));
    }

    @PostMapping
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        return ResponseEntity.ok(farmService.saveFarm(farm));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable Long id, @RequestBody Farm farm) {
        farm.setId(id);
        return ResponseEntity.ok(farmService.saveFarm(farm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return ResponseEntity.noContent().build();
    }
} 