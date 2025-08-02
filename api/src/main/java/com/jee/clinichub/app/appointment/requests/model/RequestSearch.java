package com.jee.clinichub.app.appointment.requests.model;
import java.util.Date;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestSearch {

@Temporal(TemporalType.TIMESTAMP)
private Date date;    

}
