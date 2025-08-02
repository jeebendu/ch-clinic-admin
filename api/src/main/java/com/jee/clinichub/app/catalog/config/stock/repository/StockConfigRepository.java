package com.jee.clinichub.app.catalog.config.stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.config.stock.model.StockConfig;

@Repository
public interface StockConfigRepository extends JpaRepository<StockConfig, Long> {
   

}