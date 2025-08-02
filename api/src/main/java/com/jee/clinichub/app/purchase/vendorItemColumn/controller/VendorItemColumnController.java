package com.jee.clinichub.app.purchase.vendorItemColumn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumnDto;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemProj;
import com.jee.clinichub.app.purchase.vendorItemColumn.service.VendorItemColumnService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/item-position")
public class VendorItemColumnController {
    

    @Autowired
    private VendorItemColumnService vendorItemService;



    @GetMapping(value="/id/{id}")
    public VendorItemColumnDto getById(@PathVariable Long id ){
        return vendorItemService.getById(id);
    }

    @PostMapping(value="/saveOrUpdate")
    public Status saveSpecialization(@RequestBody @Valid VendorItemColumnDto VendorItemColumns,HttpServletRequest request,Errors errors ){
        return vendorItemService.saveOrUpdate(VendorItemColumns);
    }

    @GetMapping(value="/delete/all/id/{id}")
    public Status deleteByVendotId(@PathVariable Long id ){
        return vendorItemService.deleteByVendorId(id);
    }
    
    @GetMapping(value="/vendor/id/{id}")
    public VendorItemProj getByVendorId(@PathVariable Long id){
        return vendorItemService.getByVendorId(id);
    }

}
