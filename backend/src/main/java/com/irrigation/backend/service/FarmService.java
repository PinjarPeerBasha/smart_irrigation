package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.Farm;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.model.mapper.FarmMapper;
import com.irrigation.backend.model.mapper.ZoneMapper;
import com.irrigation.backend.repository.FarmRepository;
import com.irrigation.backend.repository.IrrigationScheduleRepository;
import com.irrigation.backend.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;

    private final ZoneRepository zoneRepository;

    private final IrrigationScheduleRepository irrigationScheduleRepository;

    private final FarmMapper farmMapper;
    private final ZoneMapper zoneMapper;

    public List<Farm> getAllFarms() {

        List<FarmEntity> farmEntities = farmRepository.findAll();

        // Fetch all zones and schedules in one go
        List<ZoneEntity> allZones = zoneRepository.findAll();
        List<IrrigationScheduleEntity> allSchedules = irrigationScheduleRepository.findAll();

        // Group by farmId
        Map<Long, List<ZoneEntity>> zonesByFarmId = allZones.stream()
                .collect(Collectors.groupingBy(ZoneEntity::getFarmId));

        Map<Long, List<IrrigationScheduleEntity>> schedulesByFarmId = allSchedules.stream()
                .collect(Collectors.groupingBy(IrrigationScheduleEntity::getFarmId));

        // Map to DTOs
        return farmEntities.stream()
                .map(farmEntity -> {
                    List<ZoneEntity> zones = zonesByFarmId.getOrDefault(farmEntity.getId(), List.of());
                    List<IrrigationScheduleEntity> schedules = schedulesByFarmId.getOrDefault(farmEntity.getId(), List.of());

                    return farmMapper.toDTO(farmEntity, zones, schedules);
                })
                .collect(Collectors.toList());

        /*System.out.println("getAllFarms called from frontend");

        List<Farm> retList = farmMapper.toDTOList(farmRepository.findAll());

        return retList;*/
    }

    public Optional<Farm> getFarmById(Long id) {
    /*    return farmRepository.findById(id)
                .map(farm -> farmMapper.toDTO(farm, zones));*/

        Optional<FarmEntity> farmEntity = farmRepository.findById(id);

        if (farmEntity.isEmpty()) return Optional.empty();

        List<ZoneEntity> zones = zoneRepository.findByFarmId(id); // manually fetch zones

        List<IrrigationScheduleEntity> irrigationScheduleEntities = irrigationScheduleRepository.findByFarmId(id); // manually fetch zones

        return Optional.of(farmMapper.toDTO(farmEntity.get(), zones, irrigationScheduleEntities));
    }

    public Farm saveFarm(Farm farm) {

          // this needs to be checked later
          List<ZoneEntity> zones = new ArrayList<ZoneEntity>();
          List<IrrigationScheduleEntity> irrigationScheduleEntities = new ArrayList<IrrigationScheduleEntity>();
          if (farm.getZones()!=null) zoneMapper.toEntityList(farm.getZones());
          return farmMapper.toDTO(farmRepository.save(farmMapper.toEntity(farm)), zones
                  , new ArrayList<>());
    }

    public void deleteFarm(Long id) {
        farmRepository.deleteById(id);
    }

    public List<FarmEntity> getFarmsByLocation(String location) {
        return farmRepository.findByLocation(location);
    }

    public List<FarmEntity> getFarmsByCropType(String cropType) {
        return farmRepository.findByCropType(cropType);
    }

    public List<FarmEntity> getFarmsBySoilType(String soilType) {
        return farmRepository.findBySoilType(soilType);
    }
} 