package com.jee.clinichub.app.relationship.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.relationship.model.Relationship;
import com.jee.clinichub.app.relationship.model.RelationshipDto;
import com.jee.clinichub.app.relationship.repository.RelationshipRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
@Log4j2

@Service(value="RelationshipSv")

public class RelationshipSvImpl implements RelationshipSv {
	@Autowired
	private RelationshipRepository relationshipRepository;

	@Override
	public List<RelationshipDto> getAllRelationship() {
		List<Relationship> relationshipList=relationshipRepository.findAll();
		List<RelationshipDto> relationshipDtoList=relationshipList.stream().map(RelationshipDto::new).toList();
		return relationshipDtoList;
	}

	@Override
	public RelationshipDto getById(Long id) {
		RelationshipDto relationshipDto=new RelationshipDto();
		try{
			Optional<Relationship> relationship = relationshipRepository.findById(id);
			if(relationship.isPresent()) {
				relationshipDto=new RelationshipDto(relationship.get());
			}
			
		}
		catch(Exception e){
			log.error(e.getLocalizedMessage());
			
		}
		return relationshipDto;
	}

	@Override
	public Status saveOrUpdate(@Valid RelationshipDto relationshipDto) {
		
		try {
			Relationship relationship=new Relationship();
			if(relationshipDto.getId()==null) {
				relationship=new Relationship(relationshipDto);
				
			}
			else {
				relationship=this.setRelationship(relationshipDto);
			}
			relationshipRepository.save(relationship);
			return new Status(true,((relationshipDto.getId()==null) ?  "Added" : "Updated")+ " Successfully");
			
			
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	private Relationship setRelationship(@Valid RelationshipDto relationshipDto) {
		
		Relationship exRelationship=new Relationship();
		try {
			exRelationship=relationshipRepository.findById(relationshipDto.getId()).get();
			exRelationship.setName(relationshipDto.getName());
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		
		return exRelationship;
	}

	@Override
	public Status deleteById(Long id) {
		
		try {
			Optional<Relationship> relationship = relationshipRepository.findById(id);
			if(!relationship.isPresent()){
				return new Status(false,"Relationship not Found");
				
			}
			
			relationshipRepository.deleteById(id);
			return new Status(true,"Deleted successfully");
			
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}

		
		return new Status(false,"Something went to wrong");
	}

}
