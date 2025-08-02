package com.jee.clinichub.app.purchase.order.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Search {
    
    private String vendorName;
    private Long approved;
    private Long paymentType;

    private Date fromDate;

    private Date toDate;
}
