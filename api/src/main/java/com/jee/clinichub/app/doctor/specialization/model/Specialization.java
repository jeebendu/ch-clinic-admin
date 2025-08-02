package com.jee.clinichub.app.doctor.specialization.model;

import java.io.Serializable;
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
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialization")
public class Specialization extends Auditable<String> implements Serializable{

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    @Column(name= "name")
    private String name;
    
    @Column(name= "icon")
    private String icon;
    
    @Column(name= "sort_order")
    private Integer sortOrder;

    @Column(name = "image_url")
    private String   imageUrl;

    private String path;
    
    @Column(name= "is_active")
    private boolean active;

    public Specialization( SpecializationDto specializationDto){
        this.id = specializationDto.getId();
        this.name = specializationDto.getName();
        this.icon = specializationDto.getIcon();
        this.path = specializationDto.getPath();
        this.imageUrl = specializationDto.getImageUrl();
        this.active = specializationDto.isActive();
        this.sortOrder=specializationDto.getSortOrder();
    }
}
