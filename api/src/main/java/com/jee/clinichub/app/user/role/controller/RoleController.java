package com.jee.clinichub.app.user.role.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.app.user.role.service.RoleService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.service.JwtService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/users/role")
public class RoleController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RoleService roleService;


    @Cacheable(value = "roleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<CommonProj> getAllRoles(){
        return roleService.getAllRoles();
    }
    
    //@Cacheable(value = "roleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list/type/{type}")
    public List<CommonProj> getAllRolesByType(@PathVariable String type){
        return roleService.getAllRolesByType(type);
    }
    
    
    
    @Cacheable(value = "roleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/id/{id}")
    public RoleDto getById(@PathVariable Long id ){
        return roleService.getById(id);
    }
    
    @CacheEvict(value="roleCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    public Status saveUser(@Valid @RequestBody RoleDto role){
        return roleService.saveOrUpdate(role);
    }
    
    @CacheEvict(value="roleCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return roleService.deleteById(id);
    }

}
