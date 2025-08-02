package com.jee.clinichub.app.user.role.model;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.user.role.permission.model.PermissionDto;

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
public class RoleDto {
	
	private static final Logger log = LoggerFactory.getLogger(RoleDto.class);
    
    private Long id;
    
    @NotNull(message = "Role Name is mandatory")
   	@Size(min=3, max=30,message = "Role Name should between 3 and 15")
    private String name;
    
    private List<PermissionDto> permissions = new ArrayList<PermissionDto>();
    
	
	
	public RoleDto(Role role) {
		try{
			this.id = role.getId();
			this.name = role.getName();
			role.getPermissions().forEach(permission->{
				PermissionDto p = new PermissionDto(permission);
				this.permissions.add(p);
			});
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
	}
	
	
    
}