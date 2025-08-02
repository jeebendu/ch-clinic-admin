package com.jee.clinichub.app.relationship.controler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.relationship.model.RelationshipDto;
import com.jee.clinichub.app.relationship.service.RelationshipSv;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/relationship")

public class RelationshipController {
	

    @Autowired
    private RelationshipSv relationshipSv;
    
	 @GetMapping(value="/list")
	    public List<RelationshipDto> getAllRelationship(){
	        return relationshipSv.getAllRelationship();
	    }
	 @GetMapping(value="/id/{id}")
	    public RelationshipDto getById(@PathVariable Long id ){
	        return relationshipSv.getById(id);
	    }
	 
	
	    @ResponseBody
	    @PostMapping(value="/saveOrUpdate")
	    
	    public Status saveRelationship(@RequestBody @Valid RelationshipDto relationshipDto,HttpServletRequest request,Errors errors){
	        return relationshipSv.saveOrUpdate(relationshipDto);
	    }
	    
	    @DeleteMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return relationshipSv.deleteById(id);
	    }
	

}
