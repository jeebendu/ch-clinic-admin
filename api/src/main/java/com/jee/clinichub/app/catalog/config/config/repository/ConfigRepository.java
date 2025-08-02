package com.jee.clinichub.app.catalog.config.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.config.config.model.Config;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Long> {

}
