package com.jee.clinichub.app.appointment.visitMedicines.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.visitMedicines.model.Medicines;
import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.app.appointment.visitMedicines.service.VisitMedicinService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/visit-medicine")
@RequiredArgsConstructor
public class VisitMedicinesController {

    private final VisitMedicinService vMedicinService;

    @GetMapping("/list")
    public List<MedicinesDTO> getAll() {
        return vMedicinService.getAll();
    }

    @GetMapping("/id/{id}")
    public MedicinesDTO getById(@PathVariable Long id) {
        return vMedicinService.getById(id);
    }

    @PostMapping("/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody  MedicinesDTO medicinesDto) {
        return vMedicinService.saveOrUpdate(medicinesDto);
    }

    @GetMapping("/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return vMedicinService.deleteById(id);
    }

    @GetMapping("/visit/{visitId}")
    public List<MedicinesDTO> findAllByVisitId(@PathVariable Long visitId) {
        return vMedicinService.findAllByVisitId(visitId);
    }
}
