package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.dtos.IrrigationDevice;
import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationDeviceEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.model.mapper.IrrigationDeviceMapper;
import com.irrigation.backend.model.mapper.ZoneMapper;
import com.irrigation.backend.repository.IrrigationDeviceRepository;
import com.irrigation.backend.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class IrrigationDeviceService {

    private final IrrigationDeviceRepository deviceRepository;
    private final ZoneRepository zoneRepository;
    private final AlertService alertService;
    private final IrrigationDeviceMapper irrigationDeviceMapper;
    private final ZoneMapper zoneMapper;

    public List<IrrigationDevice> getAllDevices() {

        List<IrrigationDeviceEntity> deviceEntities = deviceRepository.findAll();

        List<IrrigationDevice> deviceDTOs = new ArrayList<>();

        for (IrrigationDeviceEntity deviceEntity : deviceEntities) {
            // Step 1: Create deviceDTO from deviceEntity
            IrrigationDevice deviceDTO = irrigationDeviceMapper.toDTO(deviceEntity);

            // Step 2: Get zoneEntity by zoneId
            if (deviceEntity.getZoneId() != null) {
                ZoneEntity zoneEntity = zoneRepository.findById(deviceEntity.getZoneId()).orElse(null);

                if (zoneEntity != null) {
                    // Step 3: Map zoneEntity to zoneDTO
                    Zone zoneDTO = zoneMapper.toDTO(zoneEntity);

                    // Step 4: Set zoneDTO into deviceDTO
                    deviceDTO.setZone(zoneDTO);
                }
            }

            // Step 5: Add deviceDTO to list
            deviceDTOs.add(deviceDTO);
        }

        // Step 6: Return all deviceDTOs
        return deviceDTOs;
    }

    public Optional<IrrigationDevice> getDeviceById(Long id) {

        Optional<IrrigationDeviceEntity> irrigationDeviceEntity = deviceRepository.findById(id);

        if (irrigationDeviceEntity.isEmpty()) return Optional.empty();

        Optional<ZoneEntity> zone = zoneRepository.findById(id);// manually fetch zones

        ZoneEntity zoneEntity = zone.orElse(null);

        Zone z = zoneMapper.toDTO(zoneEntity);

        IrrigationDevice irrigationDevice = irrigationDeviceMapper.toDTO(irrigationDeviceEntity.get());
        irrigationDevice.setZone(z);
        return Optional.of(irrigationDevice);

        //return deviceRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return deviceRepository.existsById(id);
    }

    public List<IrrigationDevice> getDevicesByZone(Long zoneId) {
        return irrigationDeviceMapper.toDTOList(deviceRepository.findByZoneId(zoneId));
    }

    public List<IrrigationDevice> getDevicesByFarm(Long farmId) {

        List<ZoneEntity> zoneEntities = zoneRepository.findByFarmId(farmId);

        // Step 2: Initialize an empty list to collect all devices
        List<IrrigationDeviceEntity> allDevices = new ArrayList<>();

        // Step 3: For each zone, find devices by zoneId
        for (ZoneEntity zone : zoneEntities) {
            List<IrrigationDeviceEntity> devices = deviceRepository.findByZoneId(zone.getId());
            allDevices.addAll(devices); // Add all found devices into our master list
        }

        // Step 4: Map to DTOs and return
        return irrigationDeviceMapper.toDTOList(allDevices);


    }

    public List<IrrigationDevice> getDevicesByType(String type) {
        return irrigationDeviceMapper.toDTOList(deviceRepository.findByType(type));
    }

    public List<IrrigationDevice> getDevicesByActiveStatus(boolean active) {
        return irrigationDeviceMapper.toDTOList(deviceRepository.findByIsActive(active));
    }

    @Transactional
    public IrrigationDevice saveDevice(IrrigationDevice device) {
        // Validate the zone exists
        if (device.getZone() != null && device.getZone().getId() != null) {
            Optional<ZoneEntity> zone = zoneRepository.findById(device.getZone().getId());
            if (zone.isEmpty()) {
                throw new IllegalArgumentException("Zone with ID " + device.getZone().getId() + " does not exist");            }
            device.setZone(zoneMapper.toDTO(zone.get()));
        }

        boolean isNewDevice = device.getId() == null;
        IrrigationDeviceEntity savedDevice = deviceRepository.save(irrigationDeviceMapper.toEntity(device));

        if (isNewDevice) {
            log.info("New irrigation device created: {}", savedDevice.getName());
        } else {
            log.info("Irrigation device updated: {}", savedDevice.getName());
        }

        IrrigationDevice irrigationDevice = irrigationDeviceMapper.toDTO(savedDevice);
               irrigationDevice.setZone(device.getZone());
        return irrigationDevice;

        //return irrigationDeviceMapper.toDTO(deviceRepository.save(irrigationDeviceMapper.toEntity(device)), null ,null);
    }


    @Transactional
    public void deleteDevice(Long id) {
        deviceRepository.findById(id).ifPresent(device -> {
            deviceRepository.delete(device);
            log.info("Irrigation device deleted: {}", device.getName());
        });
    }

    @Transactional
    public IrrigationDevice startDevice(Long id) {
        IrrigationDeviceEntity device = deviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with id: " + id));

        System.out.println("Start Device called id " + id );
        System.out.println("device before " + device);
        System.out.println("device status " + device.getStatus());


      /*  if (device.getIsActive()!= null && device.getIsActive()) {
            log.warn("Cannot start device {} as it is already active", device.getName());
            throw new IllegalStateException("Device is already active");
        }*/

        System.out.println("device before " + device);
        System.out.println("device status " + device.getStatus());


        // Check if the device is operational
/*        if (!"operational".equalsIgnoreCase(device.getStatus())) {
            log.warn("Cannot start device {} as it is not operational. Current status: {}", 
                    device.getName(), device.getStatus());
            alertService.createAlert(
                    "Device Start Failed", 
                    "Cannot start device " + device.getName() + " as it is not operational",
                    "warning",
                    "Zone:" + device.getId() + ",Farm:" + device.getId());
            throw new IllegalStateException("Device is not operational");
        }*/

        System.out.println("device " + device);
        // Start the device
        device.setIsActive(true);
        device.setStatus("active");

        System.out.println("device after update" + device);


        log.info("Irrigation device started: {}", device.getName());
        IrrigationDevice irrigationDevice = irrigationDeviceMapper.toDTO(deviceRepository.save(device));
        return irrigationDevice;
    }

    @Transactional
    public IrrigationDevice stopDevice(Long id) {
        IrrigationDeviceEntity device = deviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with id: " + id));
        
        if (!device.getIsActive()) {
            log.warn("Cannot stop device {} as it is already inactive", device.getName());
            throw new IllegalStateException("Device is already inactive");
        }
        
        // Stop the device
        device.setIsActive(false);
        device.setStatus("inactive");
        
        log.info("Irrigation device stopped: {}", device.getName());
        return irrigationDeviceMapper.toDTO(deviceRepository.save(device));
    }
} 