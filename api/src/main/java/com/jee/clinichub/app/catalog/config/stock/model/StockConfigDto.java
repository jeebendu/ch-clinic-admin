package com.jee.clinichub.app.catalog.config.stock.model;

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
public class StockConfigDto {
    
    private Long id;
    
	private String qtyMin;
	
	private String expMonth;
    
	
	
	public StockConfigDto(StockConfig stockConfig) {
		this.id = stockConfig.getId();
		this.qtyMin = stockConfig.getQtyMin();
		this.expMonth = stockConfig.getExpMonth();
	}
	

    
    
}