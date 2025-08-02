package com.jee.clinichub.app.admin.clinic.clinicHoliday.model;

import java.io.Serializable;
import java.sql.Date;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "clinic_holidday")
public class ClinicHoliday extends Auditable<String> implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reason;

    private Date date;

    @OneToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;


	
	public ClinicHoliday(ClinicHolidayDto clinicHolidayDto) {
		this.id = clinicHolidayDto.getId();
		this.reason=clinicHolidayDto.getReason();
        this.date=clinicHolidayDto.getDate();
	   this.branch=Branch.fromDto(clinicHolidayDto.getBranch());
	}


}
