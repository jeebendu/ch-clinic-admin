package com.jee.clinichub.app.admin.promo.coupons.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponsSearch {

    private String name;
    private String codee;
    private Long discount;
    // private Date startDate;
    // private Date endDate;
    private String discountType;
    private Long minOrderAmount;
    private Long maxDiscount;
    private Integer limitPerUser;
   
    
  
    
}
