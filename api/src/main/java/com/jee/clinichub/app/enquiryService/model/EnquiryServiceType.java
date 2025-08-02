package com.jee.clinichub.app.enquiryService.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
//@Audited
@ToString
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "service_type")
//@EntityListeners(AuditingEntityListener.class)

public class EnquiryServiceType extends Auditable<String> implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;



	public EnquiryServiceType(EnquiryServiceTypeDto enquiryServiceTypeDto) {
		this.id=enquiryServiceTypeDto.getId();
		this.name=enquiryServiceTypeDto.getName();	
	}


	public EnquiryServiceType(long id) {
		this.id=id;
	}
	
	
	
	
	
	
	
	

}
