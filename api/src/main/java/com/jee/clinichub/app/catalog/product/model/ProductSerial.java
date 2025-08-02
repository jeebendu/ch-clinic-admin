package com.jee.clinichub.app.catalog.product.model;

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
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.config.audit.Auditable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
@Table(name = "catalog_product_serial")
@EntityListeners(AuditingEntityListener.class)
public class ProductSerial extends Auditable<String>  implements Serializable{

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    @Column(name="qty")
	private Integer qty;

    @Column(name="serial_no")
	private String serialNo;

    @JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name = "product_id")
	private Product product;

    public ProductSerial(ProductSerialDto serialDto) {
        if(serialDto.getId()!=null){
			this.id = serialDto.getId();
		}
		this.serialNo = serialDto.getSerialNo();
        this.qty=serialDto.getQty();
	}

	


}