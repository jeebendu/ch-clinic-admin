package com.jee.clinichub.app.user.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSearch {
    
    private String inputValue;
    Long role;
    Long status;
    Date timePeriod;
    Date effectiveFrom;
    Date effectiveTo;

}
