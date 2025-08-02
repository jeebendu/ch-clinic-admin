package com.jee.clinichub.app.doctor.specialization.model;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SpecializationDto {

    private Long id;

    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
    private String imageUrl;
      private String path;
    private String icon;
    private boolean active;
    private Integer sortOrder;

    public SpecializationDto( Specialization specialization){
        this.id = specialization.getId();
        this.name = specialization.getName();
        this.imageUrl = specialization.getImageUrl();
        this.icon = specialization.getIcon();
        this.active = specialization.isActive();
        this.path=specialization.getPath();
        this.sortOrder=specialization.getSortOrder();

    }

    
}
