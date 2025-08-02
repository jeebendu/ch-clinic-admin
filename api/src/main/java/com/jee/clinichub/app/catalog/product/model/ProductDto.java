package com.jee.clinichub.app.catalog.product.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.catalog.batch.model.BatchDto;
import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;

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
public class ProductDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=200,message = "Name should between 3 and 200")
    private String name;
    
	private BranchDto branch;

	private CategoryDto category;
	
	private BrandDto brand;
	
	private ProductTypeDto type;
	
	private Integer qty;
	
	private Integer qtyLoose;
	
	private double price;
	
	private String rackNo;
	
	private int stripsPerBox;
	
	private int capPerStrip;
	
	private boolean isBatched;

	List<ProductSerialDto> serials = new ArrayList<ProductSerialDto>();
	
	List<BatchDto> batchList = new ArrayList<BatchDto>();
    
	public ProductDto(Product product) {
		if(product!=null && product.getId()!=null){
			this.id = product.getId();
		}
		
		if(product.getBranch()!=null && product.getBranch().getId()!=null){
			this.branch = new BranchDto(product.getBranch());
		}
		if(product.getCategory()!=null && product.getCategory().getId()!=null){
			this.category = new CategoryDto(product.getCategory());
		}
		
		if(product.getBrand()!=null && product.getBrand().getId()!=null){
			this.brand = new BrandDto(product.getBrand());
		}
		
		if(product.getType()!=null && product.getType().getId()!=null){
			this.type = new ProductTypeDto(product.getType());
		}
		
		this.name = product.getName();
		this.qty = product.getQty();
		this.qtyLoose = product.getQtyLoose();
		this.price = product.getPrice();
		this.rackNo = product.getRackNo();
		
		this.isBatched = product.isBatched();
		this.capPerStrip = product.getCapPerStrip();
		this.stripsPerBox = product.getStripsPerBox();

	
		product.serials.forEach(serial->{
			serials.add(new ProductSerialDto(serial));
		});
		
	}

	public ProductDto(String name) {
		this.name = name;
	}
	

    
    
}