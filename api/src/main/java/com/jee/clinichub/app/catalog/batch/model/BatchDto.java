package com.jee.clinichub.app.catalog.batch.model;

import jakarta.persistence.Column;

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
public class BatchDto {

	private Long id;
	
	private String uid;
	
	private int manufactureMonth;
	private int manufactureYear;
	private int expiryMonth;
	private int expiryYear;
	
	private String manufactureDate;
	
	private String expiryDate;

	private Integer quantity;
	
	private Integer qtyLoose;
	
	private double mrp;
	
	private double rate;
	
	private boolean isDelete;
	
	public BatchDto(Batch batch) {
		this.id = batch.getId();
		this.uid = batch.getUid();
		this.quantity = batch.getQuantity();
		this.expiryMonth = batch.getExpiryMonth();
		this.expiryYear=batch.getExpiryYear();
		this.manufactureMonth=batch.getManufactureMonth();
		this.manufactureYear=batch.getManufactureYear();
		
		this.mrp=batch.getMrp();
		this.rate = batch.getRate();
		this.qtyLoose = batch.getQtyLoose();
		
		
	}
}
