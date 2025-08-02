package com.jee.clinichub.app.vendor.model;

import java.io.Serializable;
import java.util.Optional;

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
@Table(name = "vendor")
@EntityListeners(AuditingEntityListener.class)
public class Vendor extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;
	
	@Column(name="contact")
	private String contact;
	
	@Column(name="address")
	private String address;

	@Column(name = "gst")
	private String gst;


	public Vendor(VendorDto vendorDto) {
		super();
		this.id = vendorDto.getId();
		this.name = vendorDto.getName();
		this.contact = vendorDto.getContact();
		this.address = vendorDto.getAddress();
		this.gst=vendorDto.getGst();
		
	}


	public Optional<Vendor> map(Object object) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'map'");
	}



	

	
}