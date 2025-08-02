package com.jee.clinichub.app.customer.model;

import java.io.Serializable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.sales.order.model.SalesOrder;
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
@Table(name = "customer")
@EntityListeners(AuditingEntityListener.class)
public class Customer extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	//@OneToOne(mappedBy="customer",cascade=CascadeType.ALL)
    //private SalesOrder salesOrder;
	
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;
	
	@Column(name="email")
	private String email;
	
	@Column(name="phone")
	private String phone;
	
	@Column(name="address")
	private String address;
	
	
	



	public Customer(CustomerDto customerDto) {
		super();
		this.id = customerDto.getId();
		this.firstName = customerDto.getFirstName();
		this.lastName = customerDto.getLastName();
		this.phone = customerDto.getPhone();
		this.address = customerDto.getAddress();
		this.email=customerDto.getEmail();
		
	}



	public Customer(Long customerId) {
		this.id = customerId;
	}

	
}