package com.jee.clinichub.app.admin.sales_folder.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.admin.sales_folder.model.SaleReportProj;
import com.jee.clinichub.app.admin.sales_folder.model.SalesReportDto;

public interface SalesService {
    

 Page<SaleReportProj> getAllSales(Pageable pageable);

SalesReportDto getById(Long id);

}
