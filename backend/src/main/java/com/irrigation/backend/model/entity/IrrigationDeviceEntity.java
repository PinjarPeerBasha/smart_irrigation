package com.irrigation.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "irrigation_devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IrrigationDeviceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deviceId;

    @Column(nullable = false)
    private String name;

    @Column
    private String type; // sprinkler, drip, etc.

    @Column
    private String status; // active, inactive, maintenance

    @Column
    private Boolean isActive = false;

    @Column
    private Double flowRate; // liters per minute

/*    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    @JsonBackReference
    //@JsonIgnoreProperties({"irrigationDevices"})
    private Zone zone;*/

    //@Column(name = "zone_id", insertable = false, updatable = false)

    @Column
    private Double lastWateringDuration; // last watering duration in minutes

    @Column
    private java.time.LocalDateTime lastWateringTime; // timestamp of last watering

    @Column
    private Long zoneId;

/*    @Transient
    private Zone zone;*/

} 