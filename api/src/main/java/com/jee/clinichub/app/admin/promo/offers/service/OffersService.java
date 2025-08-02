package com.jee.clinichub.app.admin.promo.offers.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;


import com.jee.clinichub.app.admin.promo.offers.model.OfferProjection;
import com.jee.clinichub.app.admin.promo.offers.model.OffersDto;
import com.jee.clinichub.app.admin.promo.offers.model.OffersSearch;
import com.jee.clinichub.global.model.Status;

public interface OffersService {


     List<OffersDto> findAll();

     OffersDto getById(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(MultipartFile file,OffersDto offersDto);


    Page<OfferProjection> searchByAdmin(Pageable pageable,OffersSearch offersSearch);
    
}
