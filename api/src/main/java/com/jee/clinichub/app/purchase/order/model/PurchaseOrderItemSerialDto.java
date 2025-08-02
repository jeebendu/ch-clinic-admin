package com.jee.clinichub.app.purchase.order.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.sales.order.model.SalesOrderItemSerial;

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
public class PurchaseOrderItemSerialDto  {

	private Long id;
	private Long serialId;
	private String serialNo;
	private Integer qty;


    public PurchaseOrderItemSerialDto(PurchaseOrderItemSerial purchaseOrderItemSerial) {
        if(purchaseOrderItemSerial.getId()!=null){
			this.id = purchaseOrderItemSerial.getId();
		}
		this.serialId = purchaseOrderItemSerial.getSerialId();
		this.serialNo = purchaseOrderItemSerial.getSerialNo();
        this.qty=purchaseOrderItemSerial.getQty();
    }

}
