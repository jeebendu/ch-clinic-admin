package com.jee.clinichub.app.sales.order.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.sales.order.model.SalesOrderDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderProj;
import com.jee.clinichub.app.sales.order.model.Search;
import com.jee.clinichub.app.sales.order.service.SalesOrderService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/sales/order")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    
    @GetMapping(value="/list")
    public List<SalesOrderProj> getAllSalesOrderes(HttpServletRequest request){
        return salesOrderService.getAllSalesOrders();
    }
    
    
    @GetMapping(value="/id/{id}")
    public SalesOrderDto getById(@PathVariable Long id ){
        return salesOrderService.getById(id);
    }
    
   
    
    @GetMapping(value="/print/{id}")
    public ResponseEntity<byte[]> getPDF(@PathVariable Long id) {
       
    	byte[] contents = salesOrderService.printById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "invoice.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }
    
    @CacheEvict(value="salesOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/approve/id/{id}")
    public Status approveById(@PathVariable Long id ){
        return salesOrderService.approveById(id);
    }
    
   
    @CacheEvict(value="salesOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveSalesOrder(@RequestBody @Valid SalesOrderDto salesOrder,Errors errors){
        return salesOrderService.saveOrUpdate(salesOrder);
    }
    
   
    @CacheEvict(value="salesOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return salesOrderService.deleteById(id);
    }
    
    @CacheEvict(value="salesOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/filter/{pageNo}/{pageSize}")
    public 	Page<SalesOrderProj> search(@RequestBody Search search,@PathVariable int pageNo,@PathVariable int pageSize){
        return salesOrderService.search(search,pageNo,pageSize);

    }

}
