package com.jee.clinichub.app.repair.controller;

import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.repair.model.AddressTypeDto;
import com.jee.clinichub.app.repair.model.RepairCourierDto;
import com.jee.clinichub.app.repair.model.RepairDto;
import com.jee.clinichub.app.repair.model.RepairPayment;
import com.jee.clinichub.app.repair.model.RepairPaymentDto;
import com.jee.clinichub.app.repair.model.RepairStatusDto;
import com.jee.clinichub.app.repair.service.RepairService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/repair")
public class RepairController {

    @Autowired
    private RepairService repairService;

    @GetMapping(value="/statusList")
    public List<RepairStatusDto> getRepairStatus(){
    	return repairService.getRepairStatus();
    }
    
    
    
    @GetMapping(value="/list")
    public List<RepairDto> getAllRepaires(){
        return repairService.getAllRepairs();
    }
    
  
    
    @GetMapping(value="/couriers/{repairId}")
    public List<RepairCourierDto> getCourierByRepairId(@PathVariable Long repairId ) {
    	List<RepairCourierDto> courierList = new ArrayList<>();
    	courierList = repairService.getCourierByRepairId(repairId);
    	return courierList;
    }
    
    @GetMapping(value="/couriers/delete/id/{id}")
    public Status deleteCourierById(@PathVariable Long id ){
        return repairService.deleteCourierById(id);
    }
    @GetMapping(value="/id/{id}")
    public RepairDto getById(@PathVariable Long id ){
        return repairService.getById(id);
    }
    
    
    @CacheEvict(value="repairCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveRepair(@RequestBody @Valid RepairDto repair,HttpServletRequest request,Errors errors){
        return repairService.saveOrUpdate(repair);
    }
    
   
    @CacheEvict(value="repairCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return repairService.deleteById(id);
    }
    
    @GetMapping(value="/print/id/{id}")
    public ResponseEntity<byte[]> getPDF(@PathVariable Long id) {
       
    	byte[] contents = repairService.printById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "repairForm.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }

       
    
    @GetMapping(value="/print/payment/{repairId}/pay/{payId}")
    public ResponseEntity<byte[]> printPayment(@PathVariable Long repairId , @PathVariable Long payId) {
       
    	byte[] contents = repairService.printRepairPayment(repairId , payId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "repairPayment.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }

    @GetMapping(value="/payments/{repairId}")
    public List<RepairPaymentDto> getPaymentByRepairId(@PathVariable Long repairId ) {
    	List<RepairPaymentDto> paymentList = new ArrayList<>();
    	paymentList = repairService.getPaymentByRepairId(repairId);
    	return paymentList;
    }

    @PostMapping(value="/saveOrUpdate/repairPayment")
    @ResponseBody
    public Status saveRepairPayment(@RequestBody @Valid RepairPaymentDto repairPayment,HttpServletRequest request,Errors errors){
        return repairService.saveOrUpdateRepairPayment(repairPayment);
    }
    
    @GetMapping(value="/payment/delete/id/{id}")
    public Status deletePaymentById(@PathVariable Long id ){
        return repairService.deletePaymentById(id);
    }

    @GetMapping(value="/addresstype/list")
    public List<AddressTypeDto> getAddressType(){
    	return repairService.getAddressType();
    }

}
