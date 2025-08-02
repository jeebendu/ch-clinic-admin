package com.jee.clinichub.app.appointment.vitals.conroller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.vitals.model.Vitals;
import com.jee.clinichub.app.appointment.vitals.model.VitalsDTO;
import com.jee.clinichub.app.appointment.vitals.service.VitalsService;
import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.brand.model.Search;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/api/vitals")
@RequiredArgsConstructor
public class VitalsController {
    
    private final VitalsService vitalsService;

     @GetMapping(value="/list")
    public List<VitalsDTO> getAllVitals(){
        return vitalsService.getAllVitals();
    }
    
    @GetMapping(value="/id/{id}")
    public VitalsDTO getById(@PathVariable Long id ){
        return vitalsService.getById(id);
    }
    
    
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody VitalsDTO vital){
        return vitalsService.saveOrUpdate(vital);
    }
    
   
 
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return vitalsService.deleteById(id);
    }

    @GetMapping(value="/visit/id/{id}")
    public Vitals getVitalsByVisitId(@PathVariable Long id ){
        return vitalsService.getVitalsByVisitId(id);
    }
  


}
