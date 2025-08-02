package com.jee.clinichub.app.repair.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "repair_address_type")
@EntityListeners(AuditingEntityListener.class)
public class AddressType  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

	

	
	@Column(name="name")
	private String name;
	
	

	public AddressType(AddressTypeDto addressTypeDto) {
		this.id = addressTypeDto.getId();
		this.name = addressTypeDto.getName();
	
	}



	public AddressType(Long id) {
		super();
		this.id = id;
	}


	

	
}

