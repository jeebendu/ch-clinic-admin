package com.jee.clinichub.app.admin.promo.offers.model;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class OffersDto {

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
    private Set<PlanDto> planList;
    private boolean active;


    public  OffersDto (Offers offers){

        this.id = offers.getId();
        this.name = offers.getName();
        this.codee = offers.getCodee();
        this.discount = offers.getDiscount();
        this.discountType = offers.getDiscountType();
        this.startDate = offers.getStartDate();
        this.endDate = offers.getEndDate();
        this.minOrderAmount = offers.getMinOrderAmount();
        this.maxDiscount = offers.getMaxDiscount();
        this.limitPerUser = offers.getLimitPerUser();
        this.image = offers.getImage();
        this.description = offers.getDescription();

         if(offers.getPlanList()!=null){
       this.planList= offers.getPlanList().stream().map(PlanDto::new).collect(Collectors.toSet());
    }
        
    }



    
}
