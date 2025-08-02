package com.jee.clinichub.app.catalog.batch.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.catalog.batch.model.Batch;
import com.jee.clinichub.app.catalog.batch.model.BatchDto;
import com.jee.clinichub.app.catalog.batch.repository.BatchRepository;
import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.service.BrandServiceImpl;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.model.Status;

@Service(value = "batchService")
public class BatchServiceImpl implements BatchService{
	
	private static final Logger log = LoggerFactory.getLogger(BatchServiceImpl.class);
	 @Autowired
	    private BatchRepository batchRepository;

	@Override
	public List<BatchDto> getAllBatch() {
		List<Batch> batchList = batchRepository.findAll();
    	List<BatchDto> batchDtoList = batchList.stream().map(BatchDto::new).collect(Collectors.toList());
  		return batchDtoList;
	}

	@Override
	public BatchDto getById(Long id) {
		Optional<Batch> batch =batchRepository.findById(id);
		BatchDto batchDto=new BatchDto(batch.get());
		return batchDto;
	}

	@Override
	public Status saveOrUpdate(@Valid BatchDto batchDto) {
try{
			
			boolean isExistUid = (batchDto.getId()==null) ? batchRepository.existsByUid(batchDto.getUid()): batchRepository.existsByUidAndIdNot(batchDto.getUid(),batchDto.getId());
			
			if(isExistUid){return new Status(false,"Batch Uid already exist");
	    	}
			
			Batch batch = new Batch();
			
			if(batchDto.getId()==null) {
				batch = new Batch(batchDto);
			}else{
				batch = this.setBatch(batchDto);
			}
			
			batch = batchRepository.save(batch);
			return new Status(true,( (batchDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	private Batch setBatch(@Valid BatchDto batchDto) {
		Batch exBatch = batchRepository.findById(batchDto.getId()).get();
		exBatch.setId(batchDto.getId());
		exBatch.setUid(batchDto.getUid());
		
		exBatch.setManufactureMonth(Integer.parseInt(batchDto.getManufactureDate().split("/")[0]));
		exBatch.setManufactureYear(Integer.parseInt(batchDto.getManufactureDate().split("/")[0]));
		
		exBatch.setExpiryMonth(Integer.parseInt(batchDto.getExpiryDate().split("/")[0]));
		exBatch.setExpiryYear(Integer.parseInt(batchDto.getExpiryDate().split("/")[0]));
		
		exBatch.setQuantity(batchDto.getQuantity());
		return exBatch;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Batch> batch = batchRepository.findById(id);
			if(!batch.isPresent()){
				return new Status(false,"Batch Not Found");
			}
			
			batchRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public List<BatchDto> getAllBatchByProductId(Long productId) {
		List<Batch> batchList = batchRepository.findAllByProductId(productId);
    	List<BatchDto> batchDtoList = batchList.stream().map(BatchDto::new).collect(Collectors.toList());
  		return batchDtoList;
	}
	 
	 
	
}
