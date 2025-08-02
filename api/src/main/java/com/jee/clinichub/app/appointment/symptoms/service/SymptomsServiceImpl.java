package com.jee.clinichub.app.appointment.symptoms.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;
import com.jee.clinichub.app.appointment.symptoms.model.SymptomsDto;
import com.jee.clinichub.app.appointment.symptoms.repository.SymptomsRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SymptomsServiceImpl implements SymptomsService {

	private final SymptomsRepository symptomsRepository;

	public Status saveOrUpdate(SymptomsDto symptomsDto) {
		try {

			boolean isExistName = symptomsRepository.existsByNameAndIdNot(symptomsDto.getName(),
					symptomsDto.getId() != null ? symptomsDto.getId() : -1);

			if (isExistName) {
				return new Status(false, "Symptoms Name already exist");
			}

			Symptoms symptoms = symptomsDto.getId() == null ? new Symptoms(symptomsDto) : this.setSymptoms(symptomsDto);
			symptomsRepository.save(symptoms);
			return new Status(true, ((symptomsDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Symptoms setSymptoms(SymptomsDto symptomsDto) {
		Symptoms symptoms = symptomsRepository.findById(symptomsDto.getId()).get();
		symptoms.setName(symptomsDto.getName());
		return symptoms;
	}

	@Override
	public List<SymptomsDto> getAll() {
		List<Symptoms> symptomsList = symptomsRepository.findAllByOrderByNameAsc();
		List<SymptomsDto> symptomsDtoList = symptomsList.stream().map(SymptomsDto::new).collect(Collectors.toList());
		return symptomsDtoList;
	}

	@Override
	public SymptomsDto getById(Long id) {
		SymptomsDto symptomsDto = new SymptomsDto();
		try {
			Optional<Symptoms> symptoms = symptomsRepository.findById(id);
			if (symptoms.isPresent()) {
				symptomsDto = new SymptomsDto(symptoms.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return symptomsDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			symptomsRepository.findById(id).ifPresentOrElse(symptoms -> {
				symptomsRepository.delete(symptoms);
			}, () -> {
				throw new EntityNotFoundException("Symptoms not found with id: " + id);
			});
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public List<Symptoms> filterSymptoms(SymptomsDto filter) {
	return symptomsRepository.filterByName(filter.getName()!=null?filter.getName():null);
	}

}
