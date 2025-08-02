package com.jee.clinichub.app.catalog.product.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.app.catalog.product.model.ProductProj;
import com.jee.clinichub.app.catalog.product.model.ProductSearch;
import com.jee.clinichub.app.catalog.product.model.ProductSearchProj;
import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;
import com.jee.clinichub.app.catalog.product.service.ProductService;
import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/catalog/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    
    @GetMapping(value="/list")
    public List<ProductProj> getAllProductes(){
        return productService.getAllProducts();
    }
    
    @PostMapping(value="/search")
    public List<ProductProj> serachProductes(@RequestBody Search search){
        return productService.searchProducts(search);
    }
    
    @PostMapping(value="/searchByName")
    public List<ProductSearchProj> serachByName(@RequestBody Search search){
        return productService.searchProductsByName(search);
    }
    
    //@Cacheable(value = "productCache",key = "#p0")
    @GetMapping(value="/id/{id}")
    public ProductDto getById(@PathVariable Long id ){
        return productService.getById(id);
    }
    
    @CacheEvict(value="productCache", allEntries=true)
    @PostMapping(value="/saveOrUpdate")
    public Status saveProduct(@RequestBody @Valid ProductDto product,HttpServletRequest request,Errors errors){
        return productService.saveOrUpdate(product);
    }
    
   
    @CacheEvict(value="productCache", allEntries=true)
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return productService.deleteById(id);
    }

   
    @PostMapping("/filter/{page}/{size}")
    public Page<ProductViewDTO> filterProducts(@PathVariable int page,@PathVariable int size,@RequestBody ProductSearch search) {
        return productService.filterProduct(page,size,search);
    }
}