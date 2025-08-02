package com.jee.clinichub.app.appointment.labtest.service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.labtest.model.LabTestDTO;
import com.jee.clinichub.app.appointment.labtest.repository.LabTestRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabTestServiceImpl implements LabTestService {
	
	private final LabTestRepository labTestRepository;

	@Override
	public Status saveOrUpdate(LabTestDTO labTestDTO) {
		try {
			boolean isExistName = labTestRepository.existsByNameAndIdNot(labTestDTO.getName(),
					labTestDTO.getId() != null ? labTestDTO.getId() : -1);

			if (isExistName) {
				return new Status(false, "LabTest Name already exist");
			}

			LabTest symptoms = labTestDTO.getId() == null ? new LabTest(labTestDTO) : this.setLabTest(labTestDTO);
			labTestRepository.save(symptoms);
			return new Status(true, ((labTestDTO.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private LabTest setLabTest(LabTestDTO labtestDTO) {
		LabTest labtest = labTestRepository.findById(labtestDTO.getId()).get();
		labtest.setName(labtestDTO.getName());
		return labtest;
	}

	@Override
	public List<LabTestDTO> getAll() {
		List<LabTest> labtestList = labTestRepository.findAllByOrderByNameAsc();
		List<LabTestDTO> listDTO = labtestList.stream().map(LabTestDTO::new).collect(Collectors.toList());
		return listDTO;
	}

	@Override
	public LabTestDTO getById(Long id) {
		LabTestDTO labTestDTO = new LabTestDTO();
		try {
			Optional<LabTest> labtest = labTestRepository.findById(id);
			if (labtest.isPresent()) {
				labTestDTO = new LabTestDTO(labtest.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return labTestDTO;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			labTestRepository.findById(id).ifPresentOrElse(test -> {
				labTestRepository.delete(test);
			}, () -> {
				throw new EntityNotFoundException("Lab Test not found with id: " + id);
			});
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}


	@Override
	public List<LabTest> filterLabTests(LabTestDTO filter) {
	return labTestRepository.filterByName(filter.getName()!=null?filter.getName():null);
	}


}
