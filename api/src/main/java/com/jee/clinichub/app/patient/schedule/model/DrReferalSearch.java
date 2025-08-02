package com.jee.clinichub.app.patient.schedule.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DrReferalSearch {
    
    private Integer month;
    private Integer year;
}
