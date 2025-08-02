package com.jee.clinichub.app.core.slider.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.core.slider.model.SliderProj;
import com.jee.clinichub.app.core.slider.model.SliderSearch;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface SliderService {

    Status upload(MultipartFile slider,boolean b, String tenant, SliderDto sliderObj);

    List<SliderDto> getAllSlider();

    SliderDto getById(Long id);

    Status saveOrUpdate(@Valid SliderDto sliderDto);
    
    Status deleteById(Long id);

    Page<SliderProj> filter(SliderSearch filter, int pageNo, int pageSize);
    
	List<SliderDto> getAllActiveSlider();


} 
