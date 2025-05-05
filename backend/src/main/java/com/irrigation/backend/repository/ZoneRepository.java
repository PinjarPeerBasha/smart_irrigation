package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.ZoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<ZoneEntity, Long> {
    
    List<ZoneEntity> findByFarmId(Long farmId);
    
    Optional<ZoneEntity> findByNameAndFarmId(String name, Long farmId);
    
    List<ZoneEntity> findByCropType(String cropType);
    
    List<ZoneEntity> findBySoilType(String soilType);
    
    List<ZoneEntity> findByMoistureThresholdLessThan(Double threshold);
} 