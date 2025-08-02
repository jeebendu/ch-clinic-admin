package com.jee.clinichub.app.appointment.prescription.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.repository.AppointmentsRepo;
import com.jee.clinichub.app.appointment.appointments.service.AppointmentsServiceImpl;
import com.jee.clinichub.app.appointment.prescription.model.Prescription;
import com.jee.clinichub.app.appointment.prescription.model.PrescriptionDTO;
import com.jee.clinichub.app.appointment.prescription.service.PrescriptionService;
import com.jee.clinichub.global.model.Status;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/appointment/prescription")
public class PrescriptionController {
    
    @Autowired
    private PrescriptionService pService;

    @Autowired
    AppointmentsRepo appointmentsRepo;

    @Autowired
    AppointmentsServiceImpl appointmentsServiceImpl;

    @GetMapping(value = "/list")
    public List<PrescriptionDTO> getAllPrescription() {
        return pService.getAllPrescription();
    }

    @GetMapping(value = "/id/{id}")
    public PrescriptionDTO getById(@PathVariable Long id) {
        return pService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate/appointment/id/{id}")
    public ResponseEntity<byte[]> saveDoctor(@RequestBody PrescriptionDTO prescription, Errors errors,
            @PathVariable Long id) {

        AppointmentsDto appointmentsDto = appointmentsServiceImpl.getById(id);
        appointmentsDto.setStatus(AppointmentStatus.COMPLETED);
        appointmentsServiceImpl.saveOrUpdate(appointmentsDto);
        byte[] contents = pService.saveOrUpdate(prescription);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "prescription.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }

    @CacheEvict(value = "prescriptionCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return pService.deleteById(id);
    }

    @PostMapping(value = "/filter/patient/id/{id}")
    public Page<Prescription> searchByPatientId(Pageable pageble,@PathVariable Long id) {
        return pService.searchByPatientId(pageble,id);
    }

}
