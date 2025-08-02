package com.jee.clinichub.app.courier.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "courier")
@EntityListeners(AuditingEntityListener.class)
public class Courier extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;
	
	@Column(name="website_url")
	private String websiteUrl;
	
	@Column(name="api_url")
	private String apiUrl;



	public Courier(CourierDto courierDto) {
		super();
		this.id = courierDto.getId();
		this.name = courierDto.getName();
		this.websiteUrl = courierDto.getWebsiteUrl();
		this.apiUrl = courierDto.getApiUrl();
		
	}



	

	
}