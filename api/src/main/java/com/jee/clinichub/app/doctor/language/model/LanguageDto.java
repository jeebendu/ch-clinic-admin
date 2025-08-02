package com.jee.clinichub.app.doctor.language.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class LanguageDto {

    private Long id;
    private String name;

    public LanguageDto(Language language){
        this.id=language.getId();
        this.name=language.getName();
    }
}
