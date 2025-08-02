package com.jee.clinichub.app.admin.clinic.clinicHoliday.model;

import java.sql.Date;

import com.jee.clinichub.app.branch.model.BranchDto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class ClinicHolidayDto {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    private String reason;

    private Date date;

    private BranchDto branch;

    public ClinicHolidayDto(ClinicHoliday clinicHolidayDto) {
		this.id = clinicHolidayDto.getId();
		this.reason=clinicHolidayDto.getReason();
        this.date=clinicHolidayDto.getDate();
	   this.branch=new BranchDto(clinicHolidayDto.getBranch());
	}
    
}

