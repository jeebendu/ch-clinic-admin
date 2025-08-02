package com.jee.clinichub.app.appointment.prescription.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.appointment.prescription.model.Prescription;
import com.jee.clinichub.app.appointment.prescription.model.PrescriptionDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface PrescriptionService {

    List<PrescriptionDTO> getAllPrescription();

    PrescriptionDTO getById(Long id);

    byte[] saveOrUpdate(@Valid PrescriptionDTO prescription);

    Status deleteById(Long id);

    Page<Prescription> searchByPatientId(Pageable pageble,Long patientId);
    
}
