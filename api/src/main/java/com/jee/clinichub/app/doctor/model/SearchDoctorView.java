package com.jee.clinichub.app.doctor.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchDoctorView {
    private List<Integer> genders;
    private Integer minExp;
    private Integer maxExp;
    private Integer[] specializationIds;
    private Integer[] languageIds;
    private String searchText;
}
