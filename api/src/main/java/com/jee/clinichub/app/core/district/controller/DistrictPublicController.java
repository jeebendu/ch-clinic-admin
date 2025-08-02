
package com.jee.clinichub.app.core.district.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.core.district.service.DistrictService;

@RestController
@RequestMapping("v1/public/district")
public class DistrictPublicController {

    @Autowired
    private DistrictService districtService;

    @GetMapping(value="/list/{name}")
    public List<DistrictDto> filterByName(@PathVariable String name){
        return districtService.filterByName(name);
    }

}
