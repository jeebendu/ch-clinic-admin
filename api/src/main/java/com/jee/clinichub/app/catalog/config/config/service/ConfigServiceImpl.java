package com.jee.clinichub.app.catalog.config.config.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jee.clinichub.app.catalog.config.config.model.Config;
import com.jee.clinichub.app.catalog.config.config.model.ConfigDto;
import com.jee.clinichub.app.catalog.config.config.repository.ConfigRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class ConfigServiceImpl implements ConfigService {

    @Autowired
    private ConfigRepository configRepository;

    @Override
    public Status save(@Valid ConfigDto configDto) {
        try {
            Config config = configDto.getId() == null ? new Config(configDto) : setConfig(configDto);
             configRepository.save(config);
             return new Status(true, "Config saved successfully");


        } catch (Exception e) {
            log.error("Error saving or updating : {}", e.getMessage(), e);
            return null;
        }
    }

    public Config setConfig(ConfigDto configDto) {
        return configRepository.findById(configDto.getId()).map(existData -> {
            existData.setImportKey(configDto.isImportKey());
            existData.setExportKey(configDto.isExportKey());
            return existData;
        }).orElseThrow(() -> new EntityNotFoundException("Config not found with ID: " + configDto.getId()));
    }

    @Override
    public ConfigDto getById(Long id) {
       return configRepository.findById(id).map(ConfigDto::new).orElseThrow(()->
          new EntityNotFoundException("Config not found with ID: " + id));
    }

    @Override
    public ConfigDto getConfigList( ) {
return configRepository.findAll().stream().map(ConfigDto::new).toList().get(0);
    }

}