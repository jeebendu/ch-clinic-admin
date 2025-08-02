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

public class RepairStatusDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;


	private Long id;
	private String  name;
	private String type;
	

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

	public RepairStatusDto(RepairStatus repairStatus) {
	if(repairStatus!= null){
		this.id = repairStatus.getId();
		this.name = repairStatus.getName();
		this.type = repairStatus.getType();


	}
	}

	

	
}

