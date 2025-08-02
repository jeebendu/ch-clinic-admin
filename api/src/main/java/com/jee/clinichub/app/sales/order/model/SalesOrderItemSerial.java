package com.jee.clinichub.app.sales.order.model;

import java.io.Serializable;

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
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.catalog.product.model.ProductSerialDto;
import com.jee.clinichub.config.audit.Auditable;

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
@Table(name = "sales_order_item_serial")
@EntityListeners(AuditingEntityListener.class)
public class SalesOrderItemSerial extends Auditable<String>  implements Serializable{

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    @Column(name="qty")
	private Integer qty;
    
    @Column(name="serial_id")
	private Long serialId;

    @Column(name="serial_no")
	private String serialNo;

    @JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY,cascade=CascadeType.ALL)
	@JoinColumn(name = "order_item_id")
	private SalesOrderItem salesOrderItem;
	
	@Column(name = "order_item_id",insertable = false, updatable = false)
	private Long itemId;

    public SalesOrderItemSerial(SalesOrderItemSerialDto serialDto) {
        if(serialDto.getId()!=null){
			this.id = serialDto.getId();
		}
        this.serialId = serialDto.getSerialId();
		this.serialNo = serialDto.getSerialNo();
        this.qty=serialDto.getQty();
	}

	


}