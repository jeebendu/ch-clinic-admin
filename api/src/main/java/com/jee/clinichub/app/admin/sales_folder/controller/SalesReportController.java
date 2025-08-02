package com.jee.clinichub.app.admin.sales_folder.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.jee.clinichub.app.admin.sales_folder.model.SaleReportProj;
import com.jee.clinichub.app.admin.sales_folder.model.SalesReportDto;
import com.jee.clinichub.app.admin.sales_folder.service.SalesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/v1/sales/service")
@CrossOrigin(origins = "*",maxAge = 3600)
@RequiredArgsConstructor
public class SalesReportController {

private final SalesService salesService;



 @GetMapping(value="/list")
    public Page<SaleReportProj> getAllPlans(Pageable pageable){
        return salesService.getAllSales(pageable);
    }

      @GetMapping(value="/id/{id}")
    public  SalesReportDto getById(@PathVariable Long id ){
        return salesService.getById(id);
    }

   
}
