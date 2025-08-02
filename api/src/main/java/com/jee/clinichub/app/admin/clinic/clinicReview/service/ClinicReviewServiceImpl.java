package com.jee.clinichub.app.admin.clinic.clinicReview.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReview;
import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReviewDto;
import com.jee.clinichub.app.admin.clinic.clinicReview.repository.ClinireviewRepo;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicReviewServiceImpl implements ClinicReviewService {

    private final ClinireviewRepo clinireviewRepo;

    @Override
    public List<ClinicReviewDto> getAllReview() {
        return clinireviewRepo.findAll().stream()
                .map(ClinicReviewDto::new)
                .toList();
    }

    @Override
    public ClinicReviewDto getById(Long id) {
        return clinireviewRepo.findById(id).map(ClinicReviewDto::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Review not found with id: " + id);
        });
    }

    @Override
    public Status saveOrUpdate(ClinicReviewDto reviewDto) {
        try {
            ClinicReview clinicReview = reviewDto.getId() == null ? new ClinicReview(reviewDto)
                    : update(reviewDto);
            clinireviewRepo.save(clinicReview);
            return new Status(true, reviewDto.getId() == null ? "Saved successfuly" : "Update successfuly");

        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public ClinicReview update(ClinicReviewDto reviewDto) {
        Optional<ClinicReview> optionalReview = clinireviewRepo.findById(reviewDto.getId());
        if (!optionalReview.isPresent()) {
            throw new EntityNotFoundException("Review not found with id: " + reviewDto.getId());
        }

        ClinicReview existing = optionalReview.get();
        existing.setRating(reviewDto.getRating());
        existing.setMassage(reviewDto.getMassage());
        existing.setBranch(Branch.fromDto(reviewDto.getBranch()));
        return existing;
    }

    @Override
    public Status deleteById(Long id) {
        clinireviewRepo.findById(id).ifPresentOrElse(
                Patient -> {
                    clinireviewRepo.deleteById(id);
                }, () -> {
                    throw new EntityNotFoundException("patieny not found with ID: \" + id");
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<ClinicReviewDto> getAllByClinicId(Long id) {
        return clinireviewRepo.findAllByClinic_id(id).stream()
                .map(ClinicReviewDto::new)
                .toList();
    }


        @Override
    public List<ClinicReview> getAllByBranchId(Long id) {
        return clinireviewRepo.findAllByBranch_id(id);
    }

}
