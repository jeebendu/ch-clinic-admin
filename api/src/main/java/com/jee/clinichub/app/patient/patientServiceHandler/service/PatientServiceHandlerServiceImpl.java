package com.jee.clinichub.app.patient.patientServiceHandler.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.percentage.model.Percentage;
import com.jee.clinichub.app.doctor.percentage.model.PercentageDTO;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.patientServiceHandler.model.PatientServiceHandler;
import com.jee.clinichub.app.patient.patientServiceHandler.model.PatientServiceHandlerDTO;
import com.jee.clinichub.app.patient.patientServiceHandler.repository.PatientServiceHandlerRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;


@Log4j2
@Service
public class PatientServiceHandlerServiceImpl implements PatientServiceHandlerService {

    @Autowired
    PatientServiceHandlerRepo serviceRepo;

    @Override
    public Status deleteById(Long id) {
        serviceRepo.findById(id).ifPresentOrElse(percent -> {
            serviceRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("service handler not found with ID: " + id);
        });
        return new Status(true, "Deleted Successfully");
    }


    @Override
    public List<PatientServiceHandlerDTO> getAllServiceHandler() {
        return serviceRepo.findAll().stream().map(PatientServiceHandlerDTO::new).toList();
    }



    @Override
    public PatientServiceHandlerDTO getById(Long id) {
        return serviceRepo.findById(id).map(PatientServiceHandlerDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("service handler not found with ID: " + id));
    }



    @Override
    public Status saveOrUpdate(@Valid PatientServiceHandlerDTO serviceHandlerDTO) {
        try {
            boolean isExists = serviceRepo.existsByEnquiryservicetype_idAndPatient_idAndIdNot(
                    serviceHandlerDTO.getEnquiryservicetype().getId(), serviceHandlerDTO.getPatient().getId(),
                    serviceHandlerDTO.getId() != null ? serviceHandlerDTO.getId() : -1);

            if (isExists) {
                return new Status(false, "service handler already exists");
            }
            PatientServiceHandler serviceHandler = serviceHandlerDTO.getId() == null
                    ? new PatientServiceHandler(serviceHandlerDTO)
                    : this.setPatientserviceHandler(serviceHandlerDTO);

            serviceRepo.save(serviceHandler);
            return new Status(true, serviceHandlerDTO.getId() == null ? "Added Successfully" : "Updated Successfully");
        }

        catch (Exception e) {
            log.error("Error saving or updating service handler: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

    public PatientServiceHandler setPatientserviceHandler(PatientServiceHandlerDTO serviceHandlerDTO) {
        return serviceRepo.findById(serviceHandlerDTO.getId())
                .map(existingState -> {
                    existingState
                            .setEnquiryservicetype(new EnquiryServiceType(serviceHandlerDTO.getEnquiryservicetype()));
                    existingState.setPatient(new Patient(serviceHandlerDTO.getPatient()));
                    return existingState;
                }).orElseThrow(
                        () -> new EntityNotFoundException(
                                "patient service handler not found with ID: " + serviceHandlerDTO.getId()));
    }


    @Override
    public List<PatientServiceHandlerDTO> getServicegeByPatientId(Long id) {
        
        List<PatientServiceHandler> serviceHandlerList = serviceRepo.findAllByPatient_id(id);
        return serviceHandlerList.stream().map(PatientServiceHandlerDTO::new).collect(Collectors.toList());
    }



}
