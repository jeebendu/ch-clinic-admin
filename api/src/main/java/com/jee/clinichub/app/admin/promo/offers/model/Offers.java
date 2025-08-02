package com.jee.clinichub.app.admin.promo.offers.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "offers")
public class Offers extends Auditable<String>  implements Serializable{



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name="name")
    private String name;

    @Column(name="code")
    private String codee;

    @ManyToMany
    @JoinTable(
        name = "offers_plan",
        joinColumns = @JoinColumn(name = "offers_id"),
        inverseJoinColumns = @JoinColumn(name = "plan_id")
    )
    private Set<Plan> planList;


    @Column(name="discount")
    private Long discount;

    @Column(name="discount_type")
    private String discountType;

    @Column(name="start_date")
    private Date startDate;

    @Column(name="end_date")
    private Date endDate;

    @Column(name="min_order_amount")
    private Long minOrderAmount;

    @Column(name="max_discount")
    private Long maxDiscount;

    @Column(name="limit_per_user")
    private Integer limitPerUser;

    @Column(name="image")
    private String image;

    @Column(name="description")
    private String description;
    

    public Offers(OffersDto offersDto){
        this.id=offersDto.getId();
        this.name=offersDto.getName();
        this.codee=offersDto.getCodee();
        this.discount=offersDto.getDiscount();
        this.discountType=offersDto.getDiscountType();
        this.startDate=offersDto.getStartDate();
        this.endDate=offersDto.getEndDate();
        this.minOrderAmount=offersDto.getMinOrderAmount();
        this.maxDiscount=offersDto.getMaxDiscount();
        this.limitPerUser=offersDto.getLimitPerUser();
        this.image=offersDto.getImage();
        this.description=offersDto.getDescription();

        if(offersDto.getPlanList()!=null){
       this.planList= offersDto.getPlanList().stream().map(Plan::new).collect(Collectors.toSet());
    }

    }
}
