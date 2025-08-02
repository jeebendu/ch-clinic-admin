package com.jee.clinichub.app.relationship.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
//@Audited
@ToString
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "core_relationship")
//@EntityListeners(AuditingEntityListener.class)

 
public class Relationship extends Auditable<String> implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;
	

	public Relationship(RelationshipDto relationshipDto) {
		this.id=relationshipDto.getId();
		
		this.name=relationshipDto.getName();
	}

	
	public Relationship(long id) {
		this.id=id;
	}
}
