package com.irrigation.backend.repository;

import com.irrigation.backend.model.entity.FarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmRepository extends JpaRepository<FarmEntity, Long> {
    
    Optional<FarmEntity> findByName(String name);
    
    List<FarmEntity> findByLocation(String location);
    
    List<FarmEntity> findByCropType(String cropType);
    
    List<FarmEntity> findBySoilType(String soilType);
} 