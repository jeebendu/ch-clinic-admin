package com.jee.clinichub.app.core.country.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data

@EqualsAndHashCode

@ToString
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name="core_country")
public class Country extends Auditable<String> implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	@Column(name="status")
	private boolean status;
	
	@Column(name="iso")
	private String iso;
	
	
	public Country (CountryDto countryDto) {
		if (countryDto != null && countryDto.getId() != null) {
			this.id = countryDto.getId();
			
		}
		
		this.name=countryDto.getName();
		
		this.code=countryDto.getCode();
		
		this.iso=countryDto.getIso();
		
		this.status=countryDto.isStatus();
		
		
		
	}
	
	

}
