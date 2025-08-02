package com.jee.clinichub.app.catalog.config.config.service;


import com.jee.clinichub.app.catalog.config.config.model.Config;
import com.jee.clinichub.app.catalog.config.config.model.ConfigDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface ConfigService {

    ConfigDto getById(Long id);
    ConfigDto getConfigList();


    Status save(@Valid ConfigDto config);

}
