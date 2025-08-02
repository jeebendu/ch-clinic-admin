package com.jee.clinichub.app.admin.subscription.plan.model;


import java.io.Serializable;
import java.util.Set;
import java.util.stream.Collectors;

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "plan")
public class Plan  extends Auditable<String>  implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Long price;
    @Column(name = "special_price")
    private Long specialPrice;
    @Column(name = "joining_price")
    private Long joiningPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "billing_cycle")
    private BillingCycleName billingCycle;

    @Column(name = "is_active")
    private boolean active;

	@ManyToMany
    @JoinTable(
        name = "plan_feature",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> featureList;
    
    public Plan(PlanDto plan) {
        this.id = plan.getId();
        this.name = plan.getName();
        this.description = plan.getDescription();
        this.price = plan.getPrice();
        this.specialPrice = plan.getSpecialPrice();
        this.joiningPrice = plan.getJoiningPrice();
        this.billingCycle = plan.getBillingCycle();
        this.active=plan.isActive();

    if(plan.getFeatureList()!=null){
       this.featureList= plan.getFeatureList().stream().map(Feature::new).collect(Collectors.toSet());
    }
       
    }

}
