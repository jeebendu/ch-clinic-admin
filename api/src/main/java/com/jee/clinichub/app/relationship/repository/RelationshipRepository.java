package com.jee.clinichub.app.relationship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.relationship.model.Relationship;


@Repository
public interface RelationshipRepository extends JpaRepository<Relationship,Long> {

}
