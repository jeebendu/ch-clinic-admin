package com.jee.clinichub.app.user.role.permission.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "role_permission")
@EntityListeners(AuditingEntityListener.class)
public class Permission extends Auditable<String> implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	@JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "role_id", nullable = false)
	private Role role;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "module_id", nullable = false)
	private Module module;
	
	@Column(name="_read")
	private boolean read;
	
	@Column(name="_write")
	private boolean write;
	
	@Column(name="upload")
	private boolean upload;
	
	@Column(name="print")
	private boolean print;

	

	public Permission(PermissionDto permissionDto) {
		this.id=permissionDto.getId();
		this.module = new Module(permissionDto.getModule());
		this.read=permissionDto.isRead();
		this.write=permissionDto.isWrite();
		this.print=permissionDto.isPrint();
		this.upload=permissionDto.isUpload();
	}

	
	
	
}