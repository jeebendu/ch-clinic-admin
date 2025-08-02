package com.jee.clinichub.app.appointment.visitLabResult.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.appointment.visitLabResult.service.LabResultService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/lab-results")
@RequiredArgsConstructor
public class LabResultController {

    private final LabResultService labResultService;

    @GetMapping(value = "/list")
    public List<LabResultDTO> getAll() {
        return labResultService.getAll();
    }

    @GetMapping(value = "/id/{id}")
    public LabResultDTO getById(@PathVariable Long id) {
        return labResultService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody LabResultDTO labResultDTO) {
        return labResultService.saveOrUpdate(labResultDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return labResultService.deleteById(id);
    }
}