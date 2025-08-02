package com.jee.clinichub.app.core.status.model;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.core.module.model.ModuleDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatusDTO {

    private Long id;

    @NotBlank(message = "name can't be null")
    @Size(min = 2, max = 30, message = "Name size should be in between 2 & 30")
    private String name;

    private ModuleDto module;
    private String color;
    
    private long count;
    
    private long sortOrder;

    public StatusDTO(StatusModel status) {
        this.id = status.getId();
        this.name = status.getName();
        this.module=new ModuleDto(status.getModule());
        this.color=status.getColor();
        this.sortOrder=status.getSortOrder();
    }

	public StatusDTO(Long id, String name,  String color,long sortOrder,  long count) {
		this.id = id;
		this.name = name;
		this.count = count;
		this.sortOrder = sortOrder;
		this.color = color;
	}
    
}
