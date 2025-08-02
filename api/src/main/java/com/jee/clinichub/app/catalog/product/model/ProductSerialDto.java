package com.jee.clinichub.app.catalog.product.model;

import com.fasterxml.jackson.annotation.JsonInclude;

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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductSerialDto {

	private Long id;

	private Integer qty;
	
	private String  serialNo;


    public ProductSerialDto(ProductSerial productSerial) {
        if(productSerial.getId()!=null){
			this.id = productSerial.getId();
		}
		this.serialNo = productSerial.getSerialNo();
        this.qty=productSerial.getQty();
    }

}
