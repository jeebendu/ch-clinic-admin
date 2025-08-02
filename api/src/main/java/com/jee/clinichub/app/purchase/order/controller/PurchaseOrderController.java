package com.jee.clinichub.app.purchase.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.purchase.order.model.PurchaseOrderDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderProj;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderScan;
import com.jee.clinichub.app.purchase.order.model.Search;
import com.jee.clinichub.app.purchase.order.service.PurchaseOrderService;
import com.jee.clinichub.app.sales.order.model.SalesOrderProj;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/purchase/order")
public class PurchaseOrderController {
    
    @Autowired
    private PurchaseOrderService purchaseOrderService;
    

    @GetMapping(value="/list")
    public List<PurchaseOrderProj> getAllPurchaseOrderes(HttpServletRequest request){
        return purchaseOrderService.getAllPurchaseOrders();
    }
    
    
    @GetMapping(value="/id/{id}")
    public PurchaseOrderDto getById(@PathVariable Long id ){
        return purchaseOrderService.getById(id);
    }
    
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/approve/id/{id}")
    public Status approveById(@PathVariable Long id ){
        return purchaseOrderService.approveById(id);
    }
    
    
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status savePurchaseOrder(@RequestBody @Valid PurchaseOrderDto purchaseOrder,HttpServletRequest request,Errors errors){
        return purchaseOrderService.saveOrUpdate(purchaseOrder);
    }
    
   
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return purchaseOrderService.deleteById(id);
    }
    

    @GetMapping(value="/print/{id}")
    public ResponseEntity<byte[]> getPDF(@PathVariable Long id) {
       
    	byte[] contents = purchaseOrderService.printById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "invoice.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }
    
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/scan")
    public PurchaseOrderScan scan(@RequestParam("file") MultipartFile image)throws Exception {
        byte[] imageData = image.getBytes();
        return purchaseOrderService.scan(imageData);
    }
    
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/process")
    public Status process(@RequestBody PurchaseOrderScan poItemScan)throws Exception {
        return purchaseOrderService.process(poItemScan);

    }
 
    @CacheEvict(value="PurchaseOrderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/filter/{pageNo}/{pageSize}")
    public 	Page<PurchaseOrderProj> search(@RequestBody Search search,@PathVariable int pageNo,@PathVariable int pageSize){
        return purchaseOrderService.search(search,pageNo,pageSize);

    }

}
