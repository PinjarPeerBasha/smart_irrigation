package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.model.mapper.ZoneMapper;
import com.irrigation.backend.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final ZoneMapper zoneMapper;

    public List<Zone> getAllZones() {
        return zoneMapper.toDTOList(zoneRepository.findAll());
    }

    public Optional<Zone> getZoneById(Long id) {
        Optional<ZoneEntity> zoneEntity = zoneRepository.findById(id);

        if (zoneEntity.isEmpty()) return Optional.empty();


        return Optional.of(zoneMapper.toDTO(zoneEntity.get()));
    }

    public Zone saveZone(Zone zone) {

        System.out.println("zoneFarmId -" + zone.getFarm().getId());
        Zone retZone = zoneMapper.toDTO(zoneRepository.save(zoneMapper.toEntity(zone)));
        retZone.setFarm(zone.getFarm());
        return retZone;
    }

    public void deleteZone(Long id) {
        zoneRepository.deleteById(id);
    }

    public List<Zone> getZonesByFarm(Long farmId) {
        return zoneMapper.toDTOList(zoneRepository.findByFarmId(farmId));
    }

    public Optional<Zone> getZoneByNameAndFarm(String name, Long farmId) {

        Optional<ZoneEntity> zoneEntity = zoneRepository.findByNameAndFarmId(name, farmId);

        if (zoneEntity.isEmpty()) return Optional.empty();


        return Optional.of(zoneMapper.toDTO(zoneEntity.get()));

    }

    public List<Zone> getZonesByCropType(String cropType) {
        return zoneMapper.toDTOList(zoneRepository.findByCropType(cropType));
    }

    public List<Zone> getZonesBySoilType(String soilType) {
        return zoneMapper.toDTOList(zoneRepository.findBySoilType(soilType));
    }

    public List<Zone> getZonesByMoistureThresholdLessThan(Double threshold) {
        return zoneMapper.toDTOList(zoneRepository.findByMoistureThresholdLessThan(threshold));
    }
} 