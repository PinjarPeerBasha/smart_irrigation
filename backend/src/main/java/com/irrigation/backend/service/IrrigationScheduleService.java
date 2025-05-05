package com.irrigation.backend.service;

import com.irrigation.backend.model.dtos.IrrigationSchedule;
import com.irrigation.backend.model.dtos.Zone;
import com.irrigation.backend.model.entity.FarmEntity;
import com.irrigation.backend.model.entity.IrrigationDeviceEntity;
import com.irrigation.backend.model.entity.IrrigationScheduleEntity;
import com.irrigation.backend.model.entity.ZoneEntity;
import com.irrigation.backend.model.mapper.IrrigationScheduleMapper;
import com.irrigation.backend.model.mapper.ZoneMapper;
import com.irrigation.backend.repository.IrrigationDeviceRepository;
import com.irrigation.backend.repository.IrrigationScheduleRepository;
import com.irrigation.backend.repository.ZoneRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class IrrigationScheduleService {

    private final IrrigationScheduleRepository scheduleRepository;
    private final ZoneRepository zoneRepository;
    private final IrrigationDeviceRepository deviceRepository;
    private final IrrigationDeviceService deviceService;
    private final IrrigationScheduleMapper irrigationScheduleMapper;
    private final ZoneMapper zoneMapper;
    private final MqttSenderService mqttSenderService;

    public List<IrrigationSchedule> getAllSchedules() {

        List<IrrigationScheduleEntity> irrigationScheduleEntities = scheduleRepository.findAll();

        List<IrrigationSchedule> irrigationSchedules = new ArrayList<>();

        for(IrrigationScheduleEntity IrrigationEntity : irrigationScheduleEntities) {

            ZoneEntity zoneEntity = zoneRepository.findById(IrrigationEntity.getZoneId()).get();

            IrrigationSchedule irrigationSchedule = irrigationScheduleMapper.toDTO(IrrigationEntity);

            irrigationSchedules.add(irrigationSchedule);

            irrigationSchedule.setZone(zoneMapper.toDTO(zoneEntity));

        }

        return irrigationSchedules;
    }

    public Optional<IrrigationSchedule> getScheduleById(Long id) {

        Optional<IrrigationScheduleEntity> scheduleEntity = scheduleRepository.findById(id);

        if (scheduleEntity.isEmpty()) return Optional.empty();

        return Optional.of(irrigationScheduleMapper.toDTO(scheduleEntity.get()));
    }

    public IrrigationSchedule saveSchedule(IrrigationSchedule schedule) {
        // Ensure zone exists
        ZoneEntity zoneEntity = zoneRepository.findById( schedule.getZone().getId())
                .orElseThrow(() -> new EntityNotFoundException("Zone not found with id: " + schedule.getZone().getId()));

        System.out.println("Schedule : " + schedule);

        schedule.setFarmId(zoneEntity.getFarmId());
        // For new schedules, set default status
        if (schedule.getId() == null && schedule.getStatus() == null) {
            schedule.setStatus("scheduled");
        }



        return irrigationScheduleMapper.toDTO(scheduleRepository.save(irrigationScheduleMapper.toEntity(schedule)));
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<IrrigationSchedule> getSchedulesByFarm(Long farmId) {
        return irrigationScheduleMapper.toDTOList(scheduleRepository.findByFarmId(farmId));
    }

    public List<IrrigationSchedule> getSchedulesByZone(Long zoneId) {
        return irrigationScheduleMapper.toDTOList(scheduleRepository.findByZoneId(zoneId));
    }

    public List<IrrigationSchedule> getSchedulesByStatus(String status) {
        return irrigationScheduleMapper.toDTOList(scheduleRepository.findByStatus(status));
    }

    public List<IrrigationSchedule> getSchedulesInTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return irrigationScheduleMapper.toDTOList(scheduleRepository.findByScheduledStartTimeBetween(startTime, endTime));
    }

    public List<IrrigationSchedule> getSchedulesByFarmAndZone(Long farmId, Long zoneId) {
        // Custom logic to find by both farm and zone
        List<IrrigationScheduleEntity> schedules = scheduleRepository.findByFarmId(farmId);
        return schedules.stream()
                .filter(schedule -> schedule.getZoneId().equals(zoneId))
                .map(irrigationScheduleMapper::toDTO)
                .toList();
    }

    public List<IrrigationSchedule> getUpcomingSchedules() {
        return irrigationScheduleMapper.toDTOList(scheduleRepository.findByScheduledStartTimeAfterAndStatus(
                LocalDateTime.now(), "scheduled"));
    }

    @Transactional
    public IrrigationSchedule executeSchedule(Long id) {
        IrrigationScheduleEntity schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        
        if (!"scheduled".equals(schedule.getStatus())) {
            throw new IllegalStateException("Cannot execute schedule with status: " + schedule.getStatus());
        }
        
        // Start all irrigation devices in the zone
        //Zone zone = schedule.getZone();

        List<IrrigationDeviceEntity> devices = deviceRepository.findByZoneId(schedule.getZoneId());
        
        if (devices.isEmpty()) {
            throw new IllegalStateException("No irrigation devices found for zone: " + schedule.getZoneId());
        }

            for (IrrigationDeviceEntity device : devices) {
                deviceService.startDevice(device.getId());
            }




        // Update schedule status
        schedule.setStatus("completed");
        schedule.setCompletedTime(LocalDateTime.now());
        
        // Calculate water used (simplified calculation)
        double waterUsed = devices.stream()
                .mapToDouble(device -> (device.getFlowRate() != null ? device.getFlowRate() : 0) * schedule.getDurationMinutes())
                .sum();
        schedule.setWaterUsed(waterUsed);
        
        return irrigationScheduleMapper.toDTO(scheduleRepository.save(schedule));
    }

    public IrrigationSchedule cancelSchedule(Long id) {
        IrrigationScheduleEntity schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        
        if (!"scheduled".equals(schedule.getStatus())) {
            throw new IllegalStateException("Cannot cancel schedule with status: " + schedule.getStatus());
        }
        
        schedule.setStatus("cancelled");
        return irrigationScheduleMapper.toDTO(scheduleRepository.save(schedule));
    }


    @Scheduled(fixedRate = 60000) // every 60 seconds
    public void runIrrigationScheduler() {


        log.info("runIrrigationScheduler called");

       LocalDateTime now = LocalDateTime.now();

        //LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);


        List<IrrigationScheduleEntity> allSchedules = scheduleRepository.findByStatus("scheduled");
        List<IrrigationScheduleEntity> allRunnings = scheduleRepository.findByStatus("active");

        log.info("allRunnings : " + allRunnings);

        for (IrrigationScheduleEntity schedule : allSchedules) {
            LocalDateTime nextStart = getNextExecutionTime(schedule, now);

            log.info("Next start : " + nextStart);
            if (nextStart != null) {
                LocalDateTime endTime = nextStart.plusMinutes(schedule.getDurationMinutes());

                if (!now.isBefore(nextStart) && now.isBefore(endTime)) {
                    // It's time to irrigate
                    //startIrrigation(schedule);

                    log.info("start the device for " + schedule.getScheduleName());
                    mqttSenderService.send("ON");
                    schedule.setStatus("active");
                    scheduleRepository.save(schedule);


                } else if (now.isAfter(endTime)) {
                    // Irrigation should be completed
                    //stopIrrigation(schedule);

                    mqttSenderService.send("OFF");

                    if ("Once".equalsIgnoreCase(schedule.getRecurringDays())) {
                        schedule.setStatus("completed");
                    }

                    List<IrrigationDeviceEntity> devices = deviceRepository.findByZoneId(schedule.getZoneId());
                    // Calculate water used (simplified calculation)
                    double waterUsed = devices.stream()
                            .mapToDouble(device -> (device.getFlowRate() != null ? device.getFlowRate() : 0) * schedule.getDurationMinutes())
                            .sum();
                    schedule.setWaterUsed(waterUsed);
                    schedule.setCompletedTime(now);
                    scheduleRepository.save(schedule);
                }
            }
        }

        for (IrrigationScheduleEntity runningSchedule : allRunnings) {
            LocalDateTime nextStart = runningSchedule.getScheduledStartTime(); //

            //if (nextStart != null) {
                LocalDateTime endTime = nextStart.plusMinutes(runningSchedule.getDurationMinutes());

                log.info("Next start for active devices: " + nextStart);
                log.info("now: " + now);
              if (now.isAfter(endTime)) {
                    // Irrigation should be completed
                    //stopIrrigation(schedule);
                  log.info("stop the device for " + runningSchedule.getScheduleName());

                    mqttSenderService.send("OFF");

                    if ("Once".equalsIgnoreCase(runningSchedule.getRecurringDays())) {
                        runningSchedule.setStatus("completed");
                    } else {
                        nextStart = getNextExecutionTime(runningSchedule, now);

                       if (nextStart != null) {
                           nextStart = LocalDateTime.of(nextStart.toLocalDate(), runningSchedule.getRecurringTime());
                       }
                        runningSchedule.setStatus("scheduled");
                    }


                    runningSchedule.setScheduledStartTime(nextStart);
                    runningSchedule.setCompletedTime(now);
                    scheduleRepository.save(runningSchedule);
                }
            //}
        }
    }

    private LocalDateTime getNextExecutionTime(IrrigationScheduleEntity schedule, LocalDateTime now) {
        String recurrence = schedule.getRecurringDays();
        LocalDateTime start = schedule.getScheduledStartTime();

        if (recurrence == null) recurrence = "Once";
        switch (recurrence.toLowerCase()) {
            case "once":
                return (now.isBefore(start.plusMinutes(schedule.getDurationMinutes()))) ? start : now;

            case "daily":
                while (start.plusMinutes(schedule.getDurationMinutes()).isBefore(now)) {
                    start = start.plusDays(1);
                }
                return start;
            case "weekly":
                // Repeat every 7 days from original start
                while (start.plusMinutes(schedule.getDurationMinutes()).isBefore(now)) {
                    start = start.plusWeeks(1);
                }
                return start;

            case "monthly":
                // Repeat every month from original start
                while (start.plusMinutes(schedule.getDurationMinutes()).isBefore(now)) {
                    start = start.plusMonths(1);
                }
                return start;

            default:
                return null;
        }
    }
} 