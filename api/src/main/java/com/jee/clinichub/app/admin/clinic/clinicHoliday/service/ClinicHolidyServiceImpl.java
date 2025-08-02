
package com.jee.clinichub.app.admin.clinic.clinicHoliday.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.jee.clinichub.app.admin.clinic.clinicHoliday.model.ClinicHoliday;
import com.jee.clinichub.app.admin.clinic.clinicHoliday.model.ClinicHolidayDto;
import com.jee.clinichub.app.admin.clinic.clinicHoliday.repository.ClinicHolidayRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicHolidyServiceImpl implements ClinicHolidayService {

    private final ClinicHolidayRepo cHolidayRepo;

    @Override
    public List<ClinicHolidayDto> getAllHoliday() {
        return cHolidayRepo.findAll().stream()
                .map(ClinicHolidayDto::new)
                .toList();
    }

    @Override
    public ClinicHolidayDto getById(Long id) {
        Optional<ClinicHoliday> optionalHoliday = cHolidayRepo.findById(id);
        ClinicHolidayDto clHolidayDto = new ClinicHolidayDto();

        if (optionalHoliday.isPresent()) {
            clHolidayDto = new ClinicHolidayDto(optionalHoliday.get());
        }
        return clHolidayDto;
    }

    @Override
    public Status saveOrUpdate(ClinicHolidayDto holidayDto) {
        try {
            ClinicHoliday clinicHoliday = holidayDto.getId() == null ? new ClinicHoliday(holidayDto)
                    : update(holidayDto);
            cHolidayRepo.save(clinicHoliday);
            return new Status(true, holidayDto.getId() == null ? "Saved successfuly" : "Update successfuly");

        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public ClinicHoliday update(ClinicHolidayDto holidayDto) {
        Optional<ClinicHoliday> optionalHoliday = cHolidayRepo.findById(holidayDto.getId());
        if (!optionalHoliday.isPresent()) {
            throw new EntityNotFoundException("Holiday not found with id: " + holidayDto.getId());
        }

        ClinicHoliday existing = optionalHoliday.get();
        existing.setDate(holidayDto.getDate());
        existing.setReason(holidayDto.getReason());
        return existing;
    }

    @Override
    public Status deleteById(Long id) {
        cHolidayRepo.findById(id).ifPresentOrElse(
                branch -> {
                    cHolidayRepo.deleteById(id);
                },
                () -> {

                    throw new EntityNotFoundException("Branch not found with ID: \" + id");
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<ClinicHolidayDto> getByBranchId(Long id) {
        return cHolidayRepo.findAllByBranch_id(id).stream()
                .map(ClinicHolidayDto::new)
                .toList();
    }

}
