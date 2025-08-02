package com.jee.clinichub.app.vendor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class VendorDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
	
    private String contact;
    private String address;
    private String gst;
	
	public VendorDto(Vendor vendor) {
		this.id = vendor.getId();
		this.name = vendor.getName();
		this.contact = vendor.getContact();
		this.address = vendor.getAddress();
		this.gst=vendor.getGst();
	}
	

    
    
}