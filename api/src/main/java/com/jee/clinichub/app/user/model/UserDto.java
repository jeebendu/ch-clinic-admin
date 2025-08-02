package com.jee.clinichub.app.user.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.user.role.model.RoleDto;

import jakarta.validation.constraints.NotNull;
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
public class UserDto {
    
	private Long id;
	
	@NotNull(message = "Username is mandatory")
	//@Size(min=4, max=10,message = "Name should between 4 and 10")
    private String username;
	
	@NotNull(message = "Password is mandatory")
	//@Size(min=5, max=15,message = "Password should between 5 and 15")
    private String password;
	
	@NotNull(message = "Email is mandatory")
    private String email;
	
	@NotNull(message = "Mobile is mandatory")
    private String phone;
    
    @NotNull(message = "Name is mandatory")
    private String name;

    @NotNull(message = "ClientId is mandatory")
    private String tenantOrClientId;
    
    private Date effectiveTo;
    
    private Date effectiveFrom;
    
    private BranchDto branch;
    
    private RoleDto role;

	private String image;

    public UserDto(User user) {
    	
		if(user!=null){
			
	    	this.id = user.getId();
			this.username = user.getUsername();
			this.name = user.getName();
			this.email = user.getEmail();
			this.phone = user.getPhone();
			this.effectiveFrom = user.getEffectiveFrom();
			this.effectiveTo= user.getEffectiveTo();
			this.image=user.getImage();
			
			if(user.getBranch()!=null){
				this.branch=new BranchDto(user.getBranch());
			}
			if(user.getRole()!=null){
				this.role=new RoleDto(user.getRole());
			}
			
		}
		
	}

    
}