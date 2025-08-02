package com.jee.clinichub.app.patient.schedule.model;

import java.util.Date;
import lombok.Data;

@Data
public class SearchSchedule {
    
    private Long refDrId;
    private Date fromDate;
    private Date toDate;
}
