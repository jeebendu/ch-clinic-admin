package com.jee.clinichub.app.sales.order.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Search {
    
    private String customerName;
    private Long paymentType;
    private Date fromDate=new Date();
    private Date toDate=new Date();
}


