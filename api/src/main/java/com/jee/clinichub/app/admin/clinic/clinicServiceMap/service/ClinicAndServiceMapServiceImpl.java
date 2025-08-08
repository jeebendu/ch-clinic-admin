
package com.jee.clinichub.app.admin.clinic.clinicServiceMap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicServiceMap;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicAndServiceMapDto;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.repository.ClinicServiceMapRepo;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicAndServiceMapServiceImpl implements ClinicAndServiceMapService {

    private final ClinicServiceMapRepo clinicServiceMapRepo;
    private final BranchRepository branchRepository;

    @Override
    public List<ClinicAndServiceMapDto> getAllService() {
        return clinicServiceMapRepo.findAll().stream()
                .map(ClinicAndServiceMapDto::new)
                .toList();
    }

    @Override
    public ClinicAndServiceMapDto getById(Long id) {
        return clinicServiceMapRepo.findById(id).map(ClinicAndServiceMapDto::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Review not found with id: " + id);
        });
    }

    @Override
    public Status saveOrUpdate(ClinicAndServiceMapDto clinicAndServiceMapDto) {
        try {
            Branch branch = BranchContextHolder.getCurrentBranch();

            if (branch != null && branch.getId() != null) {
                branch = branchRepository.findById(branch.getId()).get();
                clinicAndServiceMapDto.setBranch(new BranchDto(branch));
            } else {
                throw new EntityNotFoundException("Branch not found");
            }
            boolean isExists = clinicServiceMapRepo.existsByBranch_clinic_idAndBranch_idAndEnquiryService_idAndIdNot(
                    branch.getClinic().getId(),
                    branch.getId(),
                    clinicAndServiceMapDto.getEnquiryService().getId(),
                    clinicAndServiceMapDto.getId() != null ? clinicAndServiceMapDto.getId() : -1

            );

            if (isExists) {
                return new Status(false, "This Service already exists with this branch and clinic");
            }

            ClinicServiceMap clinicServiceMap = clinicAndServiceMapDto.getId() == null
                    ? new ClinicServiceMap(clinicAndServiceMapDto)
                    : update(clinicAndServiceMapDto);
            clinicServiceMap.setBranch(branch);
            clinicServiceMapRepo.save(clinicServiceMap);
            return new Status(true,
                    clinicAndServiceMapDto.getId() == null ? "Saved successfuly" : "Update successfuly");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public ClinicServiceMap update(ClinicAndServiceMapDto clinicAndServiceMapDto) {
        Optional<ClinicServiceMap> optionalService = clinicServiceMapRepo.findById(clinicAndServiceMapDto.getId());
        if (!optionalService.isPresent()) {
            throw new EntityNotFoundException("clinic service not found with id: " + clinicAndServiceMapDto.getId());
        }

        ClinicServiceMap existing = optionalService.get();

        existing.setEnquiryService(new EnquiryServiceType(clinicAndServiceMapDto.getEnquiryService()));
        existing.setBranch(Branch.fromDto(clinicAndServiceMapDto.getBranch()));
        return existing;
    }

    @Override
    public Status deleteById(Long id) {
        clinicServiceMapRepo.findById(id).ifPresentOrElse(
                Patient -> {
                    clinicServiceMapRepo.deleteById(id);
                }, () -> {
                    throw new EntityNotFoundException("patieny not found with ID: \" + id");
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<ClinicAndServiceMapDto> getAllByBranchId(Long id) {
        return clinicServiceMapRepo.findAllByBranch_id(id).stream()
                .map(ClinicAndServiceMapDto::new)
                .toList();
    }

}
