package com.jee.clinichub.app.catalog.config.stock.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.catalog.config.stock.model.StockConfig;
import com.jee.clinichub.app.catalog.config.stock.model.StockConfigDto;
import com.jee.clinichub.app.catalog.config.stock.repository.StockConfigRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "stockConfigService")
public class StockConfigServiceImpl implements StockConfigService {
	
	private static final Logger log = LoggerFactory.getLogger(StockConfigServiceImpl.class);

    @Autowired
    private StockConfigRepository stockConfigRepository;
    
	@Override
	public Status saveOrUpdate(StockConfigDto stockConfigDto) {
		try{
			
			
			StockConfig stockConfig = new StockConfig();
			
			if(stockConfigDto.getId()==null) {
				stockConfig = new StockConfig(stockConfigDto);
			}else{
				stockConfig = this.setStockConfig(stockConfigDto);
			}
			
			stockConfig = stockConfigRepository.save(stockConfig);
			return new Status(true,( (stockConfigDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private StockConfig setStockConfig(StockConfigDto stockConfigDto) {
    	StockConfig exStockConfig = stockConfigRepository.findById(stockConfigDto.getId()).get();
    	
		return exStockConfig;
		
	}

	@Override
  	public List<StockConfigDto> getAllStockConfigs() {
    	List<StockConfig> stockConfigList = stockConfigRepository.findAll();
    	List<StockConfigDto> stockConfigDtoList = stockConfigList.stream().map(StockConfigDto::new).collect(Collectors.toList());
  		return stockConfigDtoList;
  	}

    
	@Override
	@Cacheable(value = "stockConfigCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public StockConfigDto getById(Long id) {
		StockConfigDto stockConfigDto = new StockConfigDto();
		try{
			Optional<StockConfig> stockConfig = stockConfigRepository.findById(id);
			if(stockConfig.isPresent()){
				stockConfigDto = new StockConfigDto(stockConfig.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return stockConfigDto;
	}
	
	@Override
	@Cacheable(value = "stockConfigCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public StockConfig getStockConfigById(Long id) {
		StockConfig stockConfig = new StockConfig();
		try{
			Optional<StockConfig> _stockConfig = stockConfigRepository.findById(id);
			if(_stockConfig.isPresent()){
				stockConfig = _stockConfig.get();
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return stockConfig;
	}
	
	

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<StockConfig> stockConfig = stockConfigRepository.findById(id);
			if(!stockConfig.isPresent()){
				return new Status(false,"StockConfig Not Found");
			}
			
			stockConfigRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}
