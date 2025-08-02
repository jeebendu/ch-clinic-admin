package com.jee.clinichub.app.doctor.language.model;

import java.io.Serializable;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Language  extends Auditable<String>  implements Serializable{

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String name;

    public Language(LanguageDto language){
        this.id=language.getId();
        this.name=language.getName();
    }
    
}
