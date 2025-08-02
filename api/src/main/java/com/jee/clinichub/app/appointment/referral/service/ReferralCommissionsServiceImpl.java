package com.jee.clinichub.app.appointment.referral.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.referral.model.ReferralCommissions;
import com.jee.clinichub.app.appointment.referral.model.ReferralCommissionsDto;
import com.jee.clinichub.app.appointment.referral.repository.ReferralCommissionsRepo;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class ReferralCommissionsServiceImpl implements ReferralCommissionsService {

    @Autowired
    private ReferralCommissionsRepo commissionsRepo;

    @Override
    public ReferralCommissionsDto saveOrUpdate(ReferralCommissionsDto referralCommissionsDto) {
        try {
            ReferralCommissions referralCommissions = referralCommissionsDto.getId() == null
                    ? new ReferralCommissions(referralCommissionsDto)
                    : commissionsRepo.findById(referralCommissionsDto.getId())
                            .map(existing -> updateReferralCommissions(existing, referralCommissionsDto))
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Referral Commission not found with id " + referralCommissionsDto.getId()));

            ReferralCommissions savedEntity = commissionsRepo.save(referralCommissions);
            return new ReferralCommissionsDto(savedEntity);
        } catch (Exception e) {
            log.error("Error saving or updating ReferralCommissions: {}", e.getMessage());
            throw new RuntimeException("Failed to save or update ReferralCommissions");
        }
    }

    @Override
    public ReferralCommissionsDto getById(Long id) {
        return commissionsRepo.findById(id)
                .map(ReferralCommissionsDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Referral Commission not found with id " + id));
    }

    @Override
    public List<ReferralCommissionsDto> findAll() {
        return commissionsRepo.findAll().stream()
                .map(ReferralCommissionsDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferralCommissionsDto> findAllByVisitId(Long visitId) {
        return commissionsRepo.findAllByVisit_id(visitId).stream()
                .map(ReferralCommissionsDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Status deleteById(Long id) {
        try {
            commissionsRepo.findById(id).ifPresentOrElse(commissionsRepo::delete, () -> {
                throw new EntityNotFoundException("Referral Commission not found with id " + id);
            });
            return new Status(true, "Deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting ReferralCommissions: {}", e.getMessage());
            throw new RuntimeException("Failed to delete ReferralCommissions");
        }
    }

    private ReferralCommissions updateReferralCommissions(ReferralCommissions existing,
            ReferralCommissionsDto referralCommissionsDto) {
        existing.setVisit(new Schedule(referralCommissionsDto.getVisit()));
        existing.setReferralDoctor(new Doctor(referralCommissionsDto.getReferralDoctor()));
        existing.setCommissionAmount(referralCommissionsDto.getCommissionAmount());
        existing.setStatus(referralCommissionsDto.getStatus());
        existing.setCalculatedOn(referralCommissionsDto.getCalculatedOn());
        return existing;
    }
}