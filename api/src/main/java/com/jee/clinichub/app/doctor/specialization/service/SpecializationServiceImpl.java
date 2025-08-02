package com.jee.clinichub.app.doctor.specialization.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.doctor.specialization.model.Specialization;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationDoctorCount;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationDto;
import com.jee.clinichub.app.doctor.specialization.repository.SpecializationRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.doctor.repository.DoctorRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;

    private final DoctorRepository drRepo;

	private final CDNProviderService cdnProviderService;

	@Value("${upload.root.folder}")
	private String TENANT_ROOT;

	public final String FS = "/";


    public Status deleteById(Long id) {
        specializationRepository.findById(id).ifPresentOrElse(
                branch -> {
                    specializationRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("specialization not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");

    }

    @Override
    public List<SpecializationDto> getAllSepcializationn() {
        List<SpecializationDto> specializationDto = new ArrayList<>();
        specializationRepository.findAllByOrderBySortOrderAsc().stream().map(SpecializationDto::new).toList().forEach(item -> {
            specializationDto.add(item);
        });
        return specializationDto;
    }

    @Override
    public List<SpecializationDoctorCount> getAllSepcialization() {
        List<SpecializationDoctorCount> specializationDoctorCount = new ArrayList<>();

        specializationRepository.findAll().stream().map(SpecializationDoctorCount::new).toList().forEach(item -> {
            item.setDoctorCount(drRepo.countDoctorBySpecializationId(item.getId()));
            specializationDoctorCount.add(item);
        });
        return specializationDoctorCount;
    }

    @Override
    public SpecializationDto getById(Long id) {
        return specializationRepository.findById(id).map(SpecializationDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Specialization not found with ID: " + id));
    }

    @Override
    public Status saveOrUpdate(MultipartFile file, @Valid SpecializationDto specializationDto) {
        try {
            boolean nameExists = specializationRepository.existsByNameAndIdNot(specializationDto.getName(),
                    specializationDto.getId() != null ? specializationDto.getId() : -1);

            if (nameExists) {
                return new Status(false, "Branch Name already exists");
            }

            Specialization specialization = specializationDto.getId() == null ? new Specialization(specializationDto)
                    : setSpecialization(specializationDto);

            if (file != null) {
                if (!(file.isEmpty())) {
                    specialization.setImageUrl(this.uploadProfile(file));
                }
            }
            specializationRepository.save(specialization);

            return new Status(true, specializationDto.getId() == null ? "Added Successfully" : "Updated Successfully");
        } catch (Exception e) {
            log.error("Error saving or updating specialization: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

   public String uploadProfile(MultipartFile multiSlider) {
		try {
			String tenant = TenantContextHolder.getCurrentTenant();
			String tenantPath = TENANT_ROOT + FS + tenant;
			String isPublicOrPrivate = "public";
			String sliderName = String.format("%s", multiSlider.getOriginalFilename());
			String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;
			try {
				return cdnProviderService.upload(multiSlider, sliderPath);
			} catch (AmazonServiceException e) {
				log.error(e.getMessage());
				return null;
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}

	}


    private Specialization setSpecialization(@Valid SpecializationDto specializationDto) {
        Specialization specializationa = specializationRepository.findById(specializationDto.getId()).get();
        specializationa.setName(specializationDto.getName());
        specializationa.setPath(specializationDto.getPath());
        specializationa.setImageUrl(specializationDto.getImageUrl());
        return specializationa;
    }

    @Override
    public List<SpecializationDto> sepecilizationsByName(String name) {
        List<SpecializationDto> results = new ArrayList<SpecializationDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
            results = specializationRepository.findAllByNameContainingIgnoreCase(name).stream()
                    .map(SpecializationDto::new)
                    .toList();
        } catch (Exception e) {
        }
        return results;
    }

}
