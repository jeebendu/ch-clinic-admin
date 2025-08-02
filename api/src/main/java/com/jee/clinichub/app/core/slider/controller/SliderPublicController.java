package com.jee.clinichub.app.core.slider.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.core.slider.service.SliderService;

@RestController
@RequestMapping("v1/public/slider")
public class SliderPublicController {

    @Autowired
    private SliderService sliderService;

    @Cacheable(value = "sliderCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<SliderDto> getAllSlider(){
        return sliderService.getAllActiveSlider();
    }


}
