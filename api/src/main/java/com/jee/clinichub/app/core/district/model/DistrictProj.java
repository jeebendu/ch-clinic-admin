package com.jee.clinichub.app.core.district.model;

import com.jee.clinichub.app.core.state.model.StateProj;

public interface DistrictProj {
    Long getId();
    String getName();
    StateProj getState();
}
