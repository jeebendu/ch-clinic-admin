package com.jee.clinichub.app.customer.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;

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
public class CustomerDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String firstName;
    
    private String lastName;
    
    @NotNull(message = "phone is mandatory")
	//@Size(min=3, max=8,message = "phone should between 10 and 10")
	private String phone;

	private String email;

	private String address;
    
	
	public CustomerDto(Customer customer) {
		this.id = customer.getId();
		this.firstName = customer.getFirstName();
		this.lastName = customer.getLastName();
		this.phone = customer.getPhone();
		this.address = customer.getAddress();
		this.email = customer.getEmail();
	}
	

    
    
}