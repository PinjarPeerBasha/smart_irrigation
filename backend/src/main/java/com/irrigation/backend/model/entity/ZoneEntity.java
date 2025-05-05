package com.irrigation.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoneEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private Double area; // in square meters

    @Column
    private String cropType;

    @Column
    private String soilType;

    @Column(name = "farm_id", nullable = false)
    private Long farmId; // foreign key without relationship
/*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    @JsonBackReference
    private Farm farm;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<IrrigationDevice> irrigationDevices = new ArrayList<>();

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SensorData> sensorData = new ArrayList<>();
*/

    @Column
    private Double moistureThreshold; // minimum acceptable soil moisture

    @Column
    private Double wateringDuration; // default watering duration in minutes
} 