package com.jee.clinichub.app.core.gender;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/gender")
public class GenderController {

	@Autowired GenderRepository genderRepository;
	 @GetMapping(value="/list")
	    public List<Gender> getAllGenders(){
		 List<Gender> genders = genderRepository.findAll();
	        return genders;
	    }
}
