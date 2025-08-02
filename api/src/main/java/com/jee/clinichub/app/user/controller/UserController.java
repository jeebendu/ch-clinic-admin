package com.jee.clinichub.app.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.otp.model.Otp;
import com.jee.clinichub.app.user.otp.service.OtpService;
import com.jee.clinichub.app.user.repository.UserAuthRepository;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.service.TenantService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/users")
public class UserController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;
    
    @Autowired
    TenantService tenantService;
    
    @Autowired
    private UserAuthRepository userAuthRepository;
    
    @Autowired
    private  OtpService otpService;
    
    private Map<String, String> mapValue = new HashMap<>();
    private Map<String, String> userDbMap = new HashMap<>();


    @RequestMapping(value="/register", method = RequestMethod.POST)
    public Status saveUser(@Valid @RequestBody UserDto user){
        return userService.save(user);
    }
    
    
    @Cacheable(value = "userListCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<UserDto> getAllUsers(){
        return userService.getAllUsers();
    }
    
    @GetMapping(value="/id/{id}")
    public UserDto getById(@PathVariable Long id ){
        return userService.getById(id);
    }
    
    @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return userService.deleteById(id);
    }
    

    // @PostMapping("/sendOtp")
    // public void sendOtp(@Valid @RequestBody UserDto userDto) {
    // 	otpService.sendOtp(userDto);
    // }
    
    // @PostMapping("/verifyOtp")
    // public void verifyOtp(@Valid @RequestBody Otp otp) {
    // 	otpService.verifyOtp(otp);
    // }



    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value="/adminping", method = RequestMethod.GET)
    public String adminPing(){
        return "Only Admins Can Read This";
    }

    @PreAuthorize("hasRole('USER')")
    @RequestMapping(value="/userping", method = RequestMethod.GET)
    public String userPing(){
        return "Any User Can Read This";
    }
    
    @GetMapping(value="/getstaff")
    public Staff getstaff(){
        return userService.getCurrentStaff();
    }
    

    @PostMapping(value = "/id/{id}/upload-profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public Status uploadProfile(@RequestPart(value = "file") MultipartFile slider, @PathVariable("id") Long id) {
        String tenant = TenantContextHolder.getCurrentTenant();
      return  userService.uploadProfile(slider, true, tenant, id);
    }
   


}
