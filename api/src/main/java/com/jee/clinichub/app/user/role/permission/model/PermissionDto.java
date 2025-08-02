package com.jee.clinichub.app.user.role.permission.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.core.module.model.ModuleDto;
import com.jee.clinichub.app.user.role.model.RoleDto;

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
public class PermissionDto {
	
	private static final Logger log = LoggerFactory.getLogger(RoleDto.class);
    
    private Long id;
    private ModuleDto module;
	private boolean read;
	private boolean write;
	private boolean upload;
	private boolean print;
    
	
	
	public PermissionDto(Permission permission) {
		try{
			this.id = permission.getId();
			this.module=new ModuleDto(permission.getModule());
			this.read=permission.isRead();
			this.write=permission.isWrite();
			this.print=permission.isPrint();
			this.upload=permission.isUpload();
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		
	}
	
	
    
}