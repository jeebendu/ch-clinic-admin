package com.jee.clinichub.app.user.logininfo;

import java.util.Date;


import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginSearch {
    private String value;
    private Boolean status;
    private Boolean mobile;

    @jakarta.persistence.Temporal(TemporalType.TIMESTAMP)
    private Date dateFrom;

}
