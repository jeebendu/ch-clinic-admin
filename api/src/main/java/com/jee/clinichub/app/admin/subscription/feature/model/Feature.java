package com.jee.clinichub.app.admin.subscription.feature.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "feature")
public class Feature extends Auditable<String>  implements Serializable{
   
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;


    public Feature(FeatureDto feature) {
        this.id = feature.getId();
        this.name = feature.getName();
        this.description = feature.getDescription();
    }
}
