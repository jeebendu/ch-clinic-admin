package com.jee.clinichub.app.core.district.model;
import com.jee.clinichub.app.core.state.model.StateDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistrictDto {

    public Long id;

    public StateDto state;

    public String name; 

    public DistrictDto(District district)
    {
        this.id=district.getId();
        this.state=new StateDto(district.getState());
        this.name=district.getName();
    }

    
}
