package com.jee.clinichub.app.catalog.batch.model;

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

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate

@Entity
@Table(name = "catalog_batch")
@EntityListeners(AuditingEntityListener.class)
public class Batch extends Auditable<String>  implements Serializable {

	private static final long serialVersionUID = 1L;



	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	//@Convert(converter = StringAttributeConverter.class)
	@Column(name="uid")
	private String uid;
	
	//@JsonBackReference
	//@ManyToOne(fetch = FetchType.LAZY,cascade=CascadeType.ALL)
	//@JoinColumn(name = "product_id")
	//private Product product;
	
	@Column(name="product_id")
	private Long productId;
	
	@Column(name="manufacture_month")
	private int manufactureMonth;
	
	@Column(name="expiry_month")
	private int expiryMonth;
	
	@Column(name="manufacture_year")
	private int manufactureYear;
	
	@Column(name="expiry_year")
	private int expiryYear;
	
	@Column(name="qty")
	private Integer quantity;
	
	@Column(name="qty_loose")
	private Integer qtyLoose;
	
	@Column(name="mrp")
	private double mrp;
	
	@Column(name="rate")
	private double rate;
	
	public Batch(BatchDto batchDto) {
		this.id = batchDto.getId();
		this.uid = batchDto.getUid();
		this.expiryMonth = batchDto.getExpiryMonth();
		this.expiryYear = batchDto.getExpiryYear();
		this.manufactureMonth = batchDto.getManufactureMonth();
		this.manufactureYear = batchDto.getManufactureYear();
		this.quantity = batchDto.getQuantity();
		this.mrp = batchDto.getMrp();
		this.rate = batchDto.getRate();
		this.qtyLoose = batchDto.getQtyLoose();
		
	}
}
