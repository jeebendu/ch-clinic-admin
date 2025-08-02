package com.jee.clinichub.app.core.slider.controller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.core.slider.model.SliderProj;
import com.jee.clinichub.app.core.slider.model.SliderSearch;
import com.jee.clinichub.app.core.slider.service.SliderService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("v1/slider")
public class SliderController {

    private final SliderService sliderService;

    @Cacheable(value = "sliderCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/list")
    public List<SliderDto> getAllSlider() {
        return sliderService.getAllSlider();
    }
    
    @Cacheable(value = "sliderCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<SliderProj> search(@RequestBody SliderSearch filter, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return sliderService.filter(filter, pageNo, pageSize);
    }

    @Cacheable(value = "sliderCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/id/{id}")
    public SliderDto getById(@PathVariable Long id) {
        return sliderService.getById(id);
    }

    @CacheEvict(value="sliderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate")
    public Status saveRequest(@RequestBody @Valid SliderDto sliderDto, Errors errors) {
        return sliderService.saveOrUpdate(sliderDto);
    }

    @CacheEvict(value="sliderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return sliderService.deleteById(id);
    }

  
    @CacheEvict(value="sliderCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public Status upload(@RequestPart(value = "file") MultipartFile slider, @RequestPart("sliderObj") SliderDto sliderObj) {
        String tenant = TenantContextHolder.getCurrentTenant();
      return  sliderService.upload(slider, true, tenant, sliderObj);
    }

    

}
