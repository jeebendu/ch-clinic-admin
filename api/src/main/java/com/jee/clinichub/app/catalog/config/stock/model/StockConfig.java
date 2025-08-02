package com.jee.clinichub.app.catalog.config.stock.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
@Table(name = "catalog_stock_config")
@EntityListeners(AuditingEntityListener.class)
public class StockConfig extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="qty_min")
	private String qtyMin;
	
	@Column(name="exp_month")
	private String expMonth;
	
	
	public StockConfig(StockConfigDto stockConfigDto) {
		super();
		this.id = stockConfigDto.getId();
		this.qtyMin = stockConfigDto.getQtyMin();
		this.expMonth = stockConfigDto.getExpMonth();
		
	}

	
}