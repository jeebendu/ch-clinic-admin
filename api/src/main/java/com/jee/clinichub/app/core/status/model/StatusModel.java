package com.jee.clinichub.app.core.status.model;


import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
@Table(name = "core_status")
@Entity
public class StatusModel extends Auditable<String> {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToOne
    @JoinColumn(name = "module_id", nullable = true)
    private Module module;
    
    @Column(name ="color_code")
    private String color;
    
    @Column(name ="sort_order")
    private long sortOrder;


    public StatusModel(StatusDTO statusDTO) {
        
        this.id = statusDTO.getId();
        this.name = statusDTO.getName();
        this.module=new Module(statusDTO.getModule());
        this.color=statusDTO.getColor();    
        this.sortOrder=statusDTO.getSortOrder();
        
    }
}
