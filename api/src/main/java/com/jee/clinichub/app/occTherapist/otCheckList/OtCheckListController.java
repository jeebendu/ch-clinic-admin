package com.jee.clinichub.app.occTherapist.otCheckList;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;
import com.jee.clinichub.global.model.Status;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/ot/checklist")
public class OtCheckListController {

    @Autowired
    private OtCheckListService OtCheckListService;

    @Cacheable(value = "OtCheckListCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<OtCheckListDto> getAllOtCheckList(){
        return OtCheckListService.getAllOtCheckList();
    }
    
    
    @GetMapping(value="/id/{id}")
    public OtCheckListDto getById(@PathVariable Long id ){
        return OtCheckListService.getById(id);
    }
    
    @GetMapping(value = "/subcategoryid/{id}")
    public List<OtCheckListDto> getBySubCategoryId(@PathVariable Long id ) {
    return OtCheckListService.getBySubCategoryId(id);
    }
    
   
}
