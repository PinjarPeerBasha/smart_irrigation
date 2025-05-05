package com.irrigation.backend.controller;

import com.irrigation.backend.model.dtos.IrrigationDevice;
import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.service.IrrigationDeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IrrigationDeviceController {

    private final IrrigationDeviceService deviceService;

    @GetMapping
    public ResponseEntity<List<IrrigationDevice>> getDevices(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) Long zoneId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean active) {
        
        List<IrrigationDevice> devices;

        System.out.println("All GET ALL IrrigationDevices");
        if (farmId != null) {
            devices = deviceService.getDevicesByFarm(farmId);
        } else if (zoneId != null) {
            devices = deviceService.getDevicesByZone(zoneId);
        } else if (type != null) {
            devices = deviceService.getDevicesByType(type);
        } else if (active != null) {
            devices = deviceService.getDevicesByActiveStatus(active);
        } else {
            devices = deviceService.getAllDevices();
        }
        
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IrrigationDevice> getDeviceById(@PathVariable Long id) {
        System.out.println ("Peera - getDeviceById Called");

        //createDevice(createDeviceObject(id));

        Optional<IrrigationDevice> device = deviceService.getDeviceById(id);

        System.out.println ("device - " + device);

        return device.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private IrrigationDevice createDeviceObject(Long id) {

        IrrigationDevice idvc = new IrrigationDevice();
        //idvc.setId(id);
        idvc.setName("Temperature Device");
        idvc.setType("sprinkler");
        idvc.setDeviceId(Long.toString(id));
        Zone z = new Zone();
        z.setName("Bellary");
        z.setSoilType("wet");
        idvc.setZone(new Zone());
        return idvc;

    }

    @PostMapping
    public ResponseEntity<IrrigationDevice> createDevice(@RequestBody IrrigationDevice device) {
        IrrigationDevice savedDevice = deviceService.saveDevice(device);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDevice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IrrigationDevice> updateDevice(
            @PathVariable Long id,
            @RequestBody IrrigationDevice device) {
        
        if (!deviceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        device.setId(id);
        IrrigationDevice updatedDevice = deviceService.saveDevice(device);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        if (!deviceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<IrrigationDevice> startDevice(@PathVariable Long id) {
        try {

            System.out.println ("startDevice called");
            IrrigationDevice device = deviceService.startDevice(id);
            return ResponseEntity.ok(device);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/stop")
    public ResponseEntity<IrrigationDevice> stopDevice(@PathVariable Long id) {
        try {
            IrrigationDevice device = deviceService.stopDevice(id);
            return ResponseEntity.ok(device);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/control")
    public ResponseEntity<IrrigationDevice> controlDevice(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String action = request.get("action");
        if (action == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println ("Control Device called");
        try {
            IrrigationDevice device;
            if ("start".equalsIgnoreCase(action)) {
                device = deviceService.startDevice(id);
            } else if ("stop".equalsIgnoreCase(action)) {
                device = deviceService.stopDevice(id);
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(device);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 