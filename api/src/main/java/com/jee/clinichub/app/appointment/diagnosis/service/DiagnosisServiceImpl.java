package com.jee.clinichub.app.appointment.diagnosis.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.diagnosis.model.Diagnosis;
import com.jee.clinichub.app.appointment.diagnosis.model.DiagnosisDto;
import com.jee.clinichub.app.appointment.diagnosis.repository.DiagnosisRepository;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "diagnosisService")
@RequiredArgsConstructor
public class DiagnosisServiceImpl implements DiagnosisService {

	private final DiagnosisRepository diagnosisRepository;

	@Override
	public List<DiagnosisDto> getAllDiagnosis() {
		List<Diagnosis> diagnosisList = diagnosisRepository.findByOrderByNameAsc();
		List<DiagnosisDto> diagnosisDtoList = diagnosisList.stream().map(DiagnosisDto::new)
				.collect(Collectors.toList());
		return diagnosisDtoList;
	}

	@Override
	public DiagnosisDto getById(Long id) {
		DiagnosisDto diagnosisDto = new DiagnosisDto();
		try {
			Optional<Diagnosis> diagnosis = diagnosisRepository.findById(id);
			if (diagnosis.isPresent()) {
				diagnosisDto = new DiagnosisDto(diagnosis.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return diagnosisDto;
	}

	@Override
	public Status saveOrUpdate(DiagnosisDto diagnosisDto) {
		try {

			boolean isExistName = (diagnosisDto.getId() == null)
					? diagnosisRepository.existsByName(diagnosisDto.getName())
					: diagnosisRepository.existsByNameAndIdNot(diagnosisDto.getName(), diagnosisDto.getId());

			if (isExistName) {
				return new Status(false, "Diagnosis Name already exist");
			}

			Diagnosis diagnosis = new Diagnosis();

			if (diagnosisDto.getId() == null) {
				diagnosis = new Diagnosis(diagnosisDto);
			} else {
				diagnosis = this.setDiagnosis(diagnosisDto);
			}

			diagnosis = diagnosisRepository.save(diagnosis);
			return new Status(true, ((diagnosisDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private Diagnosis setDiagnosis(DiagnosisDto diagnosisDto) {
		Diagnosis exDiagnosis = diagnosisRepository.findById(diagnosisDto.getId()).get();
		exDiagnosis.setName(diagnosisDto.getName());
		return exDiagnosis;

	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Diagnosis> diagnosis = diagnosisRepository.findById(id);
			if (!diagnosis.isPresent()) {
				return new Status(false, "Diagnosis Not Found");
			}

			diagnosisRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public List<DiagnosisDto> findByName(DiagnosisDto filter) {
		return diagnosisRepository.filterByName(filter.getName()!=null?filter.getName():null);
	}

}
