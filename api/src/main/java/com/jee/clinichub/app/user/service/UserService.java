package com.jee.clinichub.app.user.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.global.model.Status;

public interface UserService {
	
	//UserDetailsService userDetailsService();
    Status save(UserDto user);
    List<User> findAll();
    User findOne(String username);
	List<UserDto> getAllUsers();
	UserDto getById(Long id);
	Status deleteById(Long id);
	User UserDtoMaptoUser(UserDto userDto);
	Status validateUser(UserDto user);
	User setUser(UserDto userDto);
	User setUser(User user);
	User setUser(UserDto userDto, User user);
	User getCurrentUser();
	Staff getCurrentStaff();
    Status uploadProfile(MultipartFile slider, boolean b, String tenant, Long id);
   
	
}
