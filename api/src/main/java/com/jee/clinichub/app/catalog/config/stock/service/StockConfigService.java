package com.jee.clinichub.app.catalog.config.stock.service;

import java.util.List;

import com.jee.clinichub.app.catalog.config.stock.model.StockConfig;
import com.jee.clinichub.app.catalog.config.stock.model.StockConfigDto;
import com.jee.clinichub.global.model.Status;

public interface StockConfigService {
	

    StockConfigDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(StockConfigDto StockConfig);

	List<StockConfigDto> getAllStockConfigs();

	StockConfig getStockConfigById(Long id);
}
