package com.jee.clinichub.app.sales.order.service;

import java.util.List;

import org.springframework.data.domain.Page;
import com.jee.clinichub.app.sales.order.model.SalesOrderDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderProj;
import com.jee.clinichub.app.sales.order.model.Search;
import com.jee.clinichub.global.model.Status;

public interface SalesOrderService {
	
	SalesOrderDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(SalesOrderDto salesOrderDto);

	List<SalesOrderProj> getAllSalesOrders();

	Status approveById(Long id);

	byte[] printById(Long id);

	public 	Page<SalesOrderProj> search(Search search, int pageNo, int pageSize);

}
