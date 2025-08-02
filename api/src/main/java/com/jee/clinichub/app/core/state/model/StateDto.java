package com.jee.clinichub.app.core.state.model;

import com.jee.clinichub.app.core.country.model.CountryDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StateDto {
    public Long id;

    public CountryDto country;

    public String name; 
    public String code;
    
    public StateDto(State state)
    {
        this.id = state.getId();
        this.country = new CountryDto(state.getCountry());
        this.name = state.getName();
        this.code=state.getCode();
    }

}
