package com.jee.clinichub.app.appointment.vitals.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.vitals.model.Vitals;
import com.jee.clinichub.app.appointment.vitals.model.VitalsDTO;
import com.jee.clinichub.app.appointment.vitals.repository.VitalsRepo;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VitalsServiceImpl implements VitalsService {

    private final VitalsRepo vitalsRepo;

    @Override
    public Vitals getVitalsByVisitId(Long id) {
        return vitalsRepo.findBySchedule_id(id);
    }

    @Override
    public Status deleteById(Long id) {
        vitalsRepo.findById(id).ifPresentOrElse(vitals -> {
            vitalsRepo.delete(vitals);
        }, () -> {
            throw new RuntimeException("Vitals not found with id: " + id);
        });
        return new Status(true, "Deleted successfully");
    }

    @Override
    public Status saveOrUpdate(VitalsDTO vitalDto) {
        try {
            boolean isExists = vitalsRepo.existsBySchedule_id(vitalDto.getSchedule().getId());
            if (isExists) {
                return new Status(false, "Vitals already exists for this visit id: " + vitalDto.getSchedule().getId());
            }
            Vitals vitals = vitalDto.getId() == null ? new Vitals(vitalDto) : setVitals(vitalDto);

            vitalsRepo.save(vitals);
            return new Status(true, vitalDto.getId() != null ? "Save Successfuly" : "Update Successfuly");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public Vitals setVitals(VitalsDTO vitalsDTO) {
        Vitals exVitals = vitalsRepo.findById(vitalsDTO.getId()).get();
        exVitals.setBloodPressure(vitalsDTO.getBloodPressure());
        exVitals.setBmi(vitalsDTO.getBmi());
        exVitals.setBsa(vitalsDTO.getBsa());
        exVitals.setHeight(vitalsDTO.getHeight());
        exVitals.setPulse(vitalsDTO.getPulse());
        exVitals.setRespiratory(vitalsDTO.getRespiratory());
        exVitals.setSchedule(new Schedule(vitalsDTO.getSchedule()));
        exVitals.setSpo2(vitalsDTO.getSpo2());
        exVitals.setTemperature(vitalsDTO.getTemperature());
        exVitals.setWaist(vitalsDTO.getWaist());
        exVitals.setWeight(vitalsDTO.getWeight());

        return exVitals;
    }

    @Override
    public VitalsDTO getById(Long id) {
        return vitalsRepo.findById(id).map(VitalsDTO::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Vitals not found with id :" + id);
        });
    }

    @Override
    public List<VitalsDTO> getAllVitals() {
        return vitalsRepo.findAll().stream().map(VitalsDTO::new).toList();
    }

}
