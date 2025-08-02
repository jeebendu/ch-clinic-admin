package com.jee.clinichub.app.sales.order.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.catalog.product.model.ProductSerialDto;

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
public class SalesOrderItemSerialDto  {

	private Long id;
	private Long serialId;
	private String serialNo;
	private Integer qty;


    public SalesOrderItemSerialDto(SalesOrderItemSerial salesOrderItemSerial) {
        if(salesOrderItemSerial.getId()!=null){
			this.id = salesOrderItemSerial.getId();
		}
		this.serialId = salesOrderItemSerial.getSerialId();
		this.serialNo = salesOrderItemSerial.getSerialNo();
        this.qty=salesOrderItemSerial.getQty();
    }

}
