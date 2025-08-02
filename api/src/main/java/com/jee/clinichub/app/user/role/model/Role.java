package com.jee.clinichub.app.user.role.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.user.role.permission.model.Permission;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "role")
@EntityListeners(AuditingEntityListener.class)
public class Role extends Auditable<String> implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	private String name;
	
	@Column(name="is_display")
	private boolean isDisplay;
	
	@Column(name="is_active")
	private boolean isActive;
	
	
	@Column(name="is_default")
	private boolean isDefault;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "role",cascade=CascadeType.ALL,fetch = FetchType.EAGER)
	private List<Permission> permissions = new ArrayList<Permission>();

	public Role(RoleDto roleDto) {
		this.id = roleDto.getId();
		this.name = roleDto.getName();
		
		roleDto.getPermissions().forEach(item->{
			Permission permission = new Permission(item);
			permission.setRole(this);
			this.permissions.add(permission);
		});
	}
	
	
}