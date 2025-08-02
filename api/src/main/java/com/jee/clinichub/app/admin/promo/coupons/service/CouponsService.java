package com.jee.clinichub.app.admin.promo.coupons.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.admin.promo.coupons.model.CouponsDto;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsProjection;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsSearch;
import com.jee.clinichub.global.model.Status;


public interface CouponsService {

    List<CouponsDto> findAll();

    CouponsDto getById(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(MultipartFile file,CouponsDto couponsDto);


    Page<CouponsProjection> searchByAdmin(Pageable pageable,CouponsSearch couponsSearch);
} 
