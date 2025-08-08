package com.jee.clinichub.app.enquiryService.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.doctor.model.DoctorStatus;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.utility.SlugUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
// @Audited
@ToString
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "service_type")
// @EntityListeners(AuditingEntityListener.class)

public class EnquiryServiceType extends Auditable<String> implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "global_id", unique = true)
	private java.util.UUID globalId;

	@PrePersist
	public void generateSlugAndGlobalUuid() {
		if (this.globalId == null) {
			this.globalId = java.util.UUID.randomUUID();
		}

	}

	public EnquiryServiceType(EnquiryServiceTypeDto enquiryServiceTypeDto) {
		this.id = enquiryServiceTypeDto.getId();
		this.name = enquiryServiceTypeDto.getName();
		this.globalId=enquiryServiceTypeDto.getGlobalId();
	}

	public EnquiryServiceType(long id) {
		this.id = id;
	}

}
