package com.jee.clinichub.app.admin.promo.coupons.model;

import java.io.Serializable;
import java.util.Date;

import org.checkerframework.checker.units.qual.C;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "coupons")
public class Coupons extends Auditable<String>  implements Serializable{


      @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name="name")
    private String name;

    @Column(name="code")
    private String codee;

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

    public Coupons(CouponsDto coupon){
        if(coupon.getId()!=null){
            this.id=coupon.getId();
        }
        this.name=coupon.getName();
        this.codee=coupon.getCodee();
        this.discount=coupon.getDiscount();
        this.discountType=coupon.getDiscountType();
        this.startDate=coupon.getStartDate();
        this.endDate=coupon.getEndDate();
        this.minOrderAmount=coupon.getMinOrderAmount();
        this.maxDiscount=coupon.getMaxDiscount();
        this.limitPerUser=coupon.getLimitPerUser();
        this.image=coupon.getImage();
        this.description=coupon.getDescription();
    }
}
