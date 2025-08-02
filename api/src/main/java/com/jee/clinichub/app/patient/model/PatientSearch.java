package com.jee.clinichub.app.patient.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientSearch {

    private String inputValue;
    private List<String> gender;

}
