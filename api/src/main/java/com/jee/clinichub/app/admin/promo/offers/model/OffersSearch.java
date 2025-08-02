package com.jee.clinichub.app.admin.promo.offers.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OffersSearch {


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
