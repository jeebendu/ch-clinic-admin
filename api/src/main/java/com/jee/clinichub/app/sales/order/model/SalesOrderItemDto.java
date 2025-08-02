package com.jee.clinichub.app.sales.order.model;



import java.util.ArrayList;
import java.util.List;

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
public class SalesOrderItemDto {
    
    private Long id;
	private double price;
	private Integer qty;
	private String qtyType;
	private double total;
	private String description;
	private Long productId;
	private String productName;
	private List<SalesOrderItemSerialDto> serials = new ArrayList<SalesOrderItemSerialDto>();
    
	
	
	public SalesOrderItemDto(SalesOrderItem salesOrderItem) {
			this.id = salesOrderItem.getId();
			this.price = salesOrderItem.getPrice();
			this.qty = salesOrderItem.getQty();
			this.qtyType = salesOrderItem.getQtyType();
			this.total=salesOrderItem.getTotal();
			this.description=salesOrderItem.getDescription();
			this.productId=salesOrderItem.getProductId();
			this.productName=salesOrderItem.getProductName();
			
			/*salesOrderItem.getSerials().forEach(item->{
				ProductSerialDto pSerialDto = new ProductSerialDto();
				pSerialDto.setId(item.getId());
				pSerialDto.setSerialNo(item.getSerialNo());
				pSerialDto.setQty(item.getQty());
				this.serials.add(pSerialDto);
			});*/
	}
	

    
    
}