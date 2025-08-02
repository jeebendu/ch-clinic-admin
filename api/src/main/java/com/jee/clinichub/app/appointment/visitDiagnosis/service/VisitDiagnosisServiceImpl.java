package com.jee.clinichub.app.appointment.visitDiagnosis.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.diagnosis.model.Diagnosis;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosis;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosisDto;
import com.jee.clinichub.app.appointment.visitDiagnosis.repository.VisitDiagnosisRepository;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "visit_diagnosis")
@RequiredArgsConstructor
public class VisitDiagnosisServiceImpl implements VisitDiagnosisService {

	private final VisitDiagnosisRepository visitDiagnosisRepo;

	@Override
	public List<VisitDiagnosisDto> getAllDiagnosis() {
		return visitDiagnosisRepo.findAll().stream().map(VisitDiagnosisDto::new).toList();
		
	}

	@Override
	public VisitDiagnosisDto getById(Long id) {
			return visitDiagnosisRepo.findById(id).map(VisitDiagnosisDto::new).orElseThrow(()->{
				throw new EntityNotFoundException("Visit diagnosis not found with id :"+id);
			});
	}

	@Override
	public Status saveOrUpdate(VisitDiagnosisDto VisitDiagnosisDto) {
		try {
			VisitDiagnosis diagnosis =VisitDiagnosisDto.getId()==null? new VisitDiagnosis(VisitDiagnosisDto) : this.setDiagnosis(VisitDiagnosisDto);
			diagnosis = visitDiagnosisRepo.save(diagnosis);
			return new Status(true, ((VisitDiagnosisDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private VisitDiagnosis setDiagnosis(VisitDiagnosisDto visitDiagnosisDto) {
		VisitDiagnosis exDiagnosis = visitDiagnosisRepo.findById(visitDiagnosisDto.getId()).get();
		exDiagnosis.setVisit(new Schedule(visitDiagnosisDto.getVisit()));
		exDiagnosis.setDiagnosis(new Diagnosis(visitDiagnosisDto.getDiagnosis()));
		exDiagnosis.setDescription(visitDiagnosisDto.getDescription());
		exDiagnosis.setDiagnosedBy(visitDiagnosisDto.getDiagnosedBy());
		exDiagnosis.setPrimary(visitDiagnosisDto.isPrimary());
		exDiagnosis.setDiagnosisCode(visitDiagnosisDto.getDiagnosisCode());
		return exDiagnosis;

	}

	@Override
	public Status deleteById(Long id) {
		try {
			visitDiagnosisRepo.findById(id).ifPresentOrElse((info)->{
				visitDiagnosisRepo.deleteById(id);
			}, ()->{
				throw new EntityNotFoundException("Visit Diagnosis not found with id :"+id);
			});

			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}


	@Override
	public List<VisitDiagnosisDto> byVisitId(Long id) {
	return null;
	}

}
