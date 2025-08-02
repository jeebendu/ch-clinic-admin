package com.jee.clinichub.app.doctor.model;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSearch {

    private String value;

    private Boolean doctorType;

	private Long specializationId;
    private List<Long> specializationList;
    private Long clinicId;
    private DoctorStatus status;
}
