package com.jee.clinichub.app.admin.sales_folder.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.sales_folder.model.SaleReportProj;
import com.jee.clinichub.app.admin.sales_folder.model.SalesReportDto;
import com.jee.clinichub.app.admin.sales_folder.repository.SalesReportRepo;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@Log4j2
@Service
@RequiredArgsConstructor
public class SalesServiceImpl  implements SalesService 
{
    private final SalesReportRepo salesRepository;
     

    @Override
    public Page<SaleReportProj> getAllSales(Pageable  pageable) {
           return salesRepository.findAllSalesReport(pageable);                                                                                                                                                                     
    }
    


     @Override
    public SalesReportDto getById(Long id) {
    
    return salesRepository.findById(id).map(SalesReportDto::new)
    .orElseThrow(() -> new EntityNotFoundException("Sales Report not found with ID: " + id));
    }

   
    
}
