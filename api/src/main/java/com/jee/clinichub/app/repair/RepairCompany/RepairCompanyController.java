package com.jee.clinichub.app.repair.RepairCompany;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.global.model.Status;

@RestController
@RequestMapping("v1/repair/company")
public class RepairCompanyController {

    @Autowired
    private RepairComapanyService repairCompanyService;
    

    @GetMapping(value="/list")
    public List<RepairCompany> getAll(){
       List<RepairCompany> rList= repairCompanyService.getAll();
        return rList;
    }

    @GetMapping(value="/id/{id}")
    public RepairCompany getById(@PathVariable Long id ){
        return repairCompanyService.getById(id);
    }

    @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return repairCompanyService.deleteById(id);
    }


    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveRepairCompany(@RequestBody @Valid RepairCompanyDto repair,HttpServletRequest request,Errors errors){
        return repairCompanyService.saveOrUpdate(repair);
    }
}
