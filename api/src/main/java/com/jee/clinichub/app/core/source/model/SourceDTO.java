package com.jee.clinichub.app.core.source.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SourceDTO {

    private Long id;

    @NotBlank(message = "name can't be null")
    @Size(min = 2, max = 30, message = "Name size should be in between 2 & 30")
    private String name;

    public SourceDTO(Source source) {
        this.id = source.getId();
        this.name = source.getName();
    }

    

}
