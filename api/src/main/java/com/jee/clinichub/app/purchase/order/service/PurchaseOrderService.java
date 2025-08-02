package com.jee.clinichub.app.purchase.order.service;


import java.util.List;

import org.springframework.data.domain.Page;

import com.jee.clinichub.app.purchase.order.model.PurchaseOrderDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderProj;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderScan;
import com.jee.clinichub.app.purchase.order.model.Search;
import com.jee.clinichub.global.model.Status;

public interface PurchaseOrderService {
	
	PurchaseOrderDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(PurchaseOrderDto purchaseOrderDto);

	List<PurchaseOrderProj> getAllPurchaseOrders();

	Status approveById(Long id);
	
	byte[] printById(Long id);

	PurchaseOrderScan scan(byte[] imageBytes);

	Status process(PurchaseOrderScan poOrderScan);
    Page<PurchaseOrderProj> search(Search search, int pageNo, int pageSize);


}
