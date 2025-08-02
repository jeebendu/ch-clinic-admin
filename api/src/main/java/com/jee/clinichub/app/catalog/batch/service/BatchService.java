package com.jee.clinichub.app.catalog.batch.service;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.app.catalog.batch.model.BatchDto;

import com.jee.clinichub.global.model.Status;

public interface BatchService {

	List<BatchDto> getAllBatch();

	BatchDto getById(Long id);

	Status saveOrUpdate(@Valid BatchDto batchDto);

	Status deleteById(Long id);

	List<BatchDto> getAllBatchByProductId(Long productId);

	

	

	

}
