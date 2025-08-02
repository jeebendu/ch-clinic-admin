package com.jee.clinichub.app.core.state.model;

import com.jee.clinichub.app.core.country.model.CountryProj;

public interface StateProj {
    Long getId();
    String getName();
    String getCode();
    CountryProj getCountry();
}
