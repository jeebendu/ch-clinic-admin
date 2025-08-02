package com.jee.clinichub.app.patient.audiometry.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.patient.audiometry.model.Audiometry;
import com.jee.clinichub.app.patient.audiometry.model.AudiometryDto;
import com.jee.clinichub.global.model.Status;

public interface AudiometryService {
	
	//Audiometry findByName(String name);

	AudiometryDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(AudiometryDto Branch);

	List<AudiometryDto> getAllAudiometrys();

	Audiometry getAudiometryById(Long id);

	List<AudiometryDto> getByPatientId(Long patientId);

	byte[] audiogramPrint(MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile, Long id);
}
