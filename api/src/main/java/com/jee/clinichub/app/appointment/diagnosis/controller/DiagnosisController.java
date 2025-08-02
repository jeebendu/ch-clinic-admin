package com.jee.clinichub.app.appointment.diagnosis.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.diagnosis.model.DiagnosisDto;
import com.jee.clinichub.app.appointment.diagnosis.service.DiagnosisService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("v1/patient/diagnosis")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    @GetMapping(value = "/list")
    public List<DiagnosisDto> getAllDiagnosis() {
        return diagnosisService.getAllDiagnosis();
    }

    @GetMapping(value = "/id/{id}")
    public DiagnosisDto getById(@PathVariable Long id) {
        return diagnosisService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    @ResponseBody
    public Status saveDiagnosis(@RequestBody @Valid DiagnosisDto diagnosisDto, HttpServletRequest request,
            Errors errors) {
        return diagnosisService.saveOrUpdate(diagnosisDto);
    }

    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return diagnosisService.deleteById(id);
    }

    @PostMapping(value = "/filter")
    public List<DiagnosisDto> search(@RequestBody  DiagnosisDto filter) {
        return diagnosisService.findByName(filter);
    }

}
