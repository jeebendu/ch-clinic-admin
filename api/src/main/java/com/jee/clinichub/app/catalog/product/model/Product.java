package com.jee.clinichub.app.catalog.product.model;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.category.model.Category;
import com.jee.clinichub.app.catalog.type.model.ProductType;
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
@Table(name = "catalog_product")
@EntityListeners(AuditingEntityListener.class)
public class Product extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "brand_id", nullable = false)
	private Brand brand;
	
	@OneToOne(optional = true,fetch = FetchType.EAGER)
	@JoinColumn(name = "type_id", nullable = false)
	private ProductType type;
	
	@Column(name="name")
	private String name;
	
	@Column(name="rack_no")
	private String rackNo;
	
	@Column(name="strips_per_box")
	private int stripsPerBox;
	
	@Column(name="cap_per_strip")
	private int capPerStrip;
	
	@Column(name="is_batched")
	private boolean isBatched;
	
	
	@Column(name="qty")
	private Integer qty;
	
	@Column(name="qty_loose")
	private Integer qtyLoose;
	
	@Column(name="price")
	private double price;

	//@Transient
	//private Integer expiryMonth;
	
	//@Transient
	//private Integer expiryYear;

	@JsonManagedReference
	@OneToMany(mappedBy = "product",cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	List<ProductSerial> serials = new ArrayList<ProductSerial>();
	

	
	public Product(ProductDto productDto) {
		this.id = productDto.getId();
		this.name = productDto.getName();
		this.qty = productDto.getQty();
		this.qtyLoose = productDto.getQtyLoose();
		this.price = productDto.getPrice();
		this.rackNo = productDto.getRackNo();
		
		this.isBatched = productDto.isBatched();
		this.capPerStrip = productDto.getCapPerStrip();
		this.stripsPerBox = productDto.getStripsPerBox();
		
		if(productDto.getBranch()!=null)
		this.branch=Branch.fromDto(productDto.getBranch());
		
		if(productDto.getBrand()!=null)
		this.brand=new Brand(productDto.getBrand());
		
		if(productDto.getType() !=null)
			this.type=new ProductType(productDto.getType());
		
		if(productDto.getCategory()!=null)
		this.category=new Category(productDto.getCategory());
		
		productDto.getSerials().forEach(_serial->{
			ProductSerial serial = new ProductSerial(_serial);
			serial.setProduct(this);
			this.serials.add(serial);
		});
		
		
		
	}



	public Product(Long id) {
		super();
		this.id = id;
	}
	
	
	
	
}