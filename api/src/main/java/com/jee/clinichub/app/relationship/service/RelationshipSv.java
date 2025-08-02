package com.jee.clinichub.app.relationship.service;

import java.util.List;

import com.jee.clinichub.app.relationship.model.RelationshipDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface RelationshipSv {

	

	public List<RelationshipDto> getAllRelationship();

	public RelationshipDto getById(Long id);

	public Status saveOrUpdate(@Valid RelationshipDto relationshipDto);

	public Status deleteById(Long id);

}
