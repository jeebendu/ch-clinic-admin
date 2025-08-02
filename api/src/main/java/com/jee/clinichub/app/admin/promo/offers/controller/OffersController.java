package com.jee.clinichub.app.admin.promo.offers.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.jee.clinichub.app.admin.promo.offers.model.OfferProjection;
import com.jee.clinichub.app.admin.promo.offers.model.OffersDto;
import com.jee.clinichub.app.admin.promo.offers.model.OffersSearch;
import com.jee.clinichub.app.admin.promo.offers.service.OffersService;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600 )
@RestController
@RequestMapping("/v1/offers")
@RequiredArgsConstructor
public class OffersController {

    private final OffersService offersService;


      @GetMapping(value="/list")
    public List<OffersDto> findAll(){
        return offersService.findAll();
    }
   

      @GetMapping(value="/id/{id}")
    public  OffersDto getById(@PathVariable Long id ){
        return offersService.getById(id);
    }

       @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return offersService.deleteById(id);
    }


    
      @PostMapping(value  = "/saveOrUpdate",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Status saveOrUpdate(@RequestPart("offersDto") OffersDto offersDto,@RequestPart("file")MultipartFile file, HttpServletRequest request, Errors errors) {
        return offersService.saveOrUpdate(file,offersDto);
    }



        @PostMapping("/admin/search")
    public Page<OfferProjection> search(Pageable pageable,@RequestBody OffersSearch offersSearch
            ) {
      
        return offersService.searchByAdmin(pageable,offersSearch);
    }


    
}
