package com.jee.clinichub.app.sales.order.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.catalog.product.model.ProductSerialDto;
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
@Table(name = "sales_order_items")
@EntityListeners(AuditingEntityListener.class)
public class SalesOrderItem extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	

	@JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "order_id")
	private SalesOrder salesOrder;
	 
	@Column(name="description")
	private String description;
	
	@Column(name="price")
	private double price;

	
	@Column(name="qty")
	private Integer qty;
	
	@Column(name="qty_type")
	private String qtyType;
	
	
	@Column(name="total")
	private double total;
	
	@Column(name="product_id")
	private Long productId;
	
	@Column(name="product_name")
	private String productName;
	
	
	@JsonManagedReference
	@OneToMany(mappedBy = "salesOrderItem",cascade=CascadeType.ALL, fetch = FetchType.LAZY)
	List<SalesOrderItemSerial> serials = new ArrayList<SalesOrderItemSerial>();
	


	public SalesOrderItem(SalesOrderItemDto salesOrderItemDto) {
		super();
		if(salesOrderItemDto.getId()!=null){
			this.id = salesOrderItemDto.getId();
		}
		this.price = salesOrderItemDto.getPrice();
		this.qty = salesOrderItemDto.getQty();
		this.qtyType = salesOrderItemDto.getQtyType();
		this.total = salesOrderItemDto.getTotal();
		this.description = salesOrderItemDto.getDescription();
		this.productId=salesOrderItemDto.getProductId();
		this.productName=salesOrderItemDto.getProductName();
		
		salesOrderItemDto.getSerials().forEach(item->{
			SalesOrderItemSerial pSerial = new SalesOrderItemSerial();
			pSerial.setId(item.getId());
			pSerial.setSerialId(item.getSerialId());
			pSerial.setSerialNo(item.getSerialNo());
			pSerial.setQty(1);
			pSerial.setSalesOrderItem(this);
			this.serials.add(pSerial);
		});
	}



	public SalesOrderItem(Long salesOrderId) {
		this.id = salesOrderId;
	}

	
}