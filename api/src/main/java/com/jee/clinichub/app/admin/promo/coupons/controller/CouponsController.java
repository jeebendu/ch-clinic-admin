package com.jee.clinichub.app.admin.promo.coupons.controller;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.admin.promo.coupons.model.CouponsDto;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsProjection;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsSearch;
import com.jee.clinichub.app.admin.promo.coupons.service.CouponsService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600 )
@RestController
@RequestMapping("/v1/coupons")
@RequiredArgsConstructor
public class CouponsController {

    private final CouponsService coupoService;

     @GetMapping(value="/list")
    public List<CouponsDto> findAll(){
        return coupoService.findAll();
    }

      @GetMapping(value="/id/{id}")
    public  CouponsDto getById(@PathVariable Long id ){
        return coupoService.getById(id);
    }

       @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return coupoService.deleteById(id);
    }


    
      @PostMapping(value  = "/saveOrUpdate",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Status saveOrUpdate(@RequestPart("couponsDto") CouponsDto couponsDto,@RequestPart("file")MultipartFile file, HttpServletRequest request, Errors errors) {
        return coupoService.saveOrUpdate(file,couponsDto);
    }



        @PostMapping("/admin/search")
    public Page<CouponsProjection> search(Pageable pageable,@RequestBody CouponsSearch couponsSearch
            ) {
      
        return coupoService.searchByAdmin(pageable,couponsSearch);
    }
    
}
