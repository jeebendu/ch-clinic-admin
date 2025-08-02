package com.jee.clinichub.app.expense.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.DataImport;
import com.jee.clinichub.app.expense.model.ExpenseDto;
import com.jee.clinichub.app.expense.model.ExpenseProj;
import com.jee.clinichub.app.expense.model.SearchExpense;
import com.jee.clinichub.app.expense.service.ExpenseService;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;
    

    @GetMapping(value="/list")
    public List<ExpenseProj> getAllExpensees(){
        return expenseService.getAllExpenses();
    }
    
    
    @GetMapping(value="/id/{id}")
    public ExpenseDto getById(@PathVariable Long id ){
        return expenseService.getById(id);
    }
    
    @CacheEvict(value="expenseCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/approve/id/{id}")
    public Status approveById(@PathVariable Long id ){
        return expenseService.approveById(id);
    }
    
    
    @CacheEvict(value="expenseCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveExpense(@RequestBody @Valid ExpenseDto expense,Errors errors){
        return expenseService.saveOrUpdate(expense);
    }
    
   
    @CacheEvict(value="expenseCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return expenseService.deleteById(id);
    }



        @PostMapping("/import")
    public Status handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
        return expenseService.importData(file);
        
        } catch (Exception e) {
        	return new Status(false, "Something went wrong");
        }
    }

    @CacheEvict(value="expenseCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/filter/{pageno}/{size}")
    public Page<ExpenseProj> handleFilter(@PathVariable int pageno,@PathVariable int size,@RequestBody SearchExpense search) {
   
        return expenseService.handleFilter(search,pageno,size);
    }

}
