package com.jee.clinichub.app.staff.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffSearch {
    private String search;
    private boolean status;

}
