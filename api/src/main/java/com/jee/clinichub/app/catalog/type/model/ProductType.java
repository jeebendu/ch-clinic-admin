package com.jee.clinichub.app.catalog.type.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;




/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "catalog_product_type")
@EntityListeners(AuditingEntityListener.class)
public class ProductType extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	//@Convert(converter = StringAttributeConverter.class)
	@Column(name="name")
	private String name;
	
	@Column(name="is_strip")
	private boolean isStrip;
	
	
	public ProductType(ProductTypeDto productTypeDto) {
		super();
		this.id = productTypeDto.getId();
		this.name = productTypeDto.getName();
		this.isStrip = productTypeDto.isStrip();
		
	}

	
}