package com.jee.clinichub.app.patient_documents.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient_documents.model.PatientDocumentsDto;
import com.jee.clinichub.app.patient_documents.service.PatientDocumentsService;
import com.jee.clinichub.global.model.Status;


@RestController
@RequestMapping("v1/patientDocument")
public class PatientDocumentsController {
	
	@Autowired PatientDocumentsService patientDocumentsService;
	
	 @GetMapping(value="/list")
	    public List<PatientDocumentsDto> getallDocuments(){
	        return patientDocumentsService.getallDocuments();
	    }
	 
	 @GetMapping(value="/id/{id}")
	    public PatientDocumentsDto getById(@PathVariable Long id){
	        return patientDocumentsService.getById(id);
	    }
	 
	 @GetMapping(value="/patientId/{id}")
	    public PatientDocumentsDto getByPId(@PathVariable Long id){
	        return patientDocumentsService.getByPId(id);
	    }
	 
	 @GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id){
	        return patientDocumentsService.delelteById(id);
	    }
	 
	 @PostMapping(value="/saveOrupdate", consumes = { "multipart/form-data" })
	    public Status saveOrupdate(
	    		@RequestBody PatientDocumentsDto patientDocumentsDto,
	    		@RequestPart(value = "logoFile",required = false) MultipartFile logoFile,
	    		@RequestPart(value = "documentName",required = false) MultipartFile documentName,
	    		@RequestPart(value = "date",required = false) MultipartFile date,
	    		@RequestPart(value = "patientId",required = false) MultipartFile patientId){
					return null;
	       // return patientDocumentsService.saveOrupdate(patientDocumentsDto);
	    }
	
	

}
