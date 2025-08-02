package com.jee.clinichub.app.appointment.prescription.service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.appointment.prescription.model.Prescription;
import com.jee.clinichub.app.appointment.prescription.model.PrescriptionDTO;
import com.jee.clinichub.app.appointment.prescription.repository.PrescriptionRepo;
import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.repository.ScheduleRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    PrescriptionRepo prescriptionRepo;

    @Autowired
    TenantService tenantService;

    @Autowired
    TemplateEngine htmlTemplateEngine;

    @Autowired
    FileService fileService;

    @Autowired
    TypeConverter typeConverter;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Override
    public List<PrescriptionDTO> getAllPrescription() {
        return prescriptionRepo.findAll().stream().map(PrescriptionDTO::new).toList();
    }

    @Override
    public PrescriptionDTO getById(Long id) {
        return prescriptionRepo.findById(id).map(PrescriptionDTO::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Prescription not found with id " + id);
        });
    }

    @Override
    public byte[] saveOrUpdate(@Valid PrescriptionDTO prescription) {
        try {
            Prescription prescriptionObj = prescription.getId() == null ? new Prescription(prescription)
                    : this.setprescription(prescription);
 
            Prescription resPrescription = prescriptionRepo.saveAndFlush(prescriptionObj);

            // Prescription savedPrescription =
            // prescriptionRepo.findById(resPrescription.getId()).orElse(null);

            String html = generateAudiometryHtml(resPrescription);
            File tempFile = File.createTempFile("prescription", ".pdf");
            FileOutputStream fos = new FileOutputStream(tempFile);
            ConverterProperties converterProperties = new ConverterProperties();
            // converterProperties.setBaseUri(getBaseUri());
            HtmlConverter.convertToPdf(html, fos, converterProperties);

            byte[] pdfBytes = typeConverter.fileToByteArray(new File(tempFile.getPath()));
            return pdfBytes;
            // return new Status(true, ((prescription.getId() == null) ? "Added" :
            // "Updated") + " Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return null; 
    }

    private String generateAudiometryHtml(Prescription prescription) {
        try {

            final Context ctx = new Context(LocaleContextHolder.getLocale());

            String tenantId = TenantContextHolder.getCurrentTenant();
            Tenant tenant = tenantService.findByTenantId(tenantId);
            String tenantLogoUrl = fileService.getSecureUrl(tenant.getLogo(), true, tenantId);

            String host = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            ctx.setVariable("cssurl", host + "/css/patient/audiogram/style.css");
            ctx.setVariable("clinicForm", "Patient Prescription");
            ctx.setVariable("clinicName", tenant.getTitle());
            ctx.setVariable("clinicLogo", tenantLogoUrl);

            ctx.setVariable("data", prescription);

            final String htmlContent = this.htmlTemplateEngine.process("patient/appointment/prescription.html", ctx);
            return htmlContent;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("something went wrong");
        }
    }

    private Prescription setprescription(PrescriptionDTO prescriptionDTO) {

        Prescription exPrescription = prescriptionRepo.findById(prescriptionDTO.getId()).get();
        exPrescription.setAdvice(prescriptionDTO.getAdvice());
        exPrescription.setClinicNotes(prescriptionDTO.getClinicNotes());
        exPrescription.setComplaints(prescriptionDTO.getComplaints());
        exPrescription.setVisit(new Schedule(prescriptionDTO.getVisit()));
        exPrescription.setFollowUp(prescriptionDTO.getFollowUp());
        exPrescription.setPreviousClinicNote(prescriptionDTO.getPreviousClinicNote());
        exPrescription.setPreviousHistory(prescriptionDTO.getPreviousHistory());
        exPrescription.setFollowUpNote(prescriptionDTO.getFollowUpNote());


        // // Get the list of medicines from the prescription
        // List<Medicines> medicinesExist = exPrescription.getMedicines();

        // List<Long> dtoItemIds = prescriptionDTO.getMedicines().stream()
        //         .map(MedicinesDTO::getId)
        //         .collect(Collectors.toList());

        // // Remove medicines from exPrescription that are not in the prescription
        // medicinesExist.removeIf(existingMedicine -> !dtoItemIds.contains(existingMedicine.getId()));

        // // Add the medicines from the prescription to the list
        // prescriptionDTO.getMedicines().forEach(itemDto -> {
        //     Medicines medicine = medicinesExist.stream()
        //             .filter(existingItem -> existingItem.getId() != null
        //                     && existingItem.getId().equals(itemDto.getId()))
        //             .findFirst()
        //             .map(existingItem -> updateMedicine(existingItem, itemDto))
        //             .orElseGet(() -> createMedicines(itemDto, exPrescription));

        //     if (!medicinesExist.contains(medicine)) {
        //         medicinesExist.add(medicine);
        //     }
        // });

        return exPrescription;

    }


 

    @Override
    public Status deleteById(Long id) {
        prescriptionRepo.findById(id).ifPresentOrElse((data) -> {
            prescriptionRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Prescription not found with id " + id);
        });
        return new Status(true, "deleted Successfully");
    }

    @Override
    public Page<Prescription> searchByPatientId(Pageable pageble, Long patientId) {
        Page<Prescription> prescriptionList = Page.empty();
        try {

            prescriptionList = prescriptionRepo.findAllByVisit_patient_id(pageble, patientId);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return prescriptionList;
    }

}
