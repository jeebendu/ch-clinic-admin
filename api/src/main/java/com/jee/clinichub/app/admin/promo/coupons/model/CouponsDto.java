package com.jee.clinichub.app.admin.promo.coupons.model;


import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponsDto {


    private Long id;
    private String name;
    private String codee;
    private Long discount;
    private String discountType;
    private Date startDate;
    private Date endDate;
    private Long minOrderAmount;
    private Long maxDiscount;
    private Integer limitPerUser;
    private String image;
    private String description;
    
    public CouponsDto(Coupons coupons) {
        this.id = coupons.getId();
        this.name = coupons.getName();
        this.codee = coupons.getCodee();
        this.discount = coupons.getDiscount();
        this.discountType = coupons.getDiscountType();
        this.startDate = coupons.getStartDate();
        this.endDate = coupons.getEndDate();
        this.minOrderAmount = coupons.getMinOrderAmount();
        this.maxDiscount = coupons.getMaxDiscount();
        this.limitPerUser = coupons.getLimitPerUser();
        this.image = coupons.getImage();
        this.description = coupons.getDescription();
    }
}
