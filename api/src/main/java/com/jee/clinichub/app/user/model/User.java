package com.jee.clinichub.app.user.model;

import java.util.Date;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.config.converter.PIIAttributeConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users" , uniqueConstraints = { 
		@UniqueConstraint(columnNames = "username"),
		@UniqueConstraint(columnNames = "phone"),
		@UniqueConstraint(columnNames = "email")})
public class User extends Auditable<String> { 
	
   
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
   
    @Column(name = "name")
    private String name;
    
    @Column(name="username")
    private String username;
    
    @Column(unique = true)
    private String email;
    
    @Column(unique = true)
    private String phone;
    
   // @Convert(converter = PIIAttributeConverter.class)
    @Column(name = "password")
    private String password;
    
    @Column(name = "effective_to")
    private Date effectiveTo;
    
    @Column(name = "effective_from")
    private Date effectiveFrom;
    
    @OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "role_id", nullable = false)
	private Role role;
    
    
    @Transient
    @OneToOne(mappedBy = "user",cascade =  CascadeType.ALL,fetch = FetchType.LAZY)
    private Doctor doctor;
    
    @Transient
    @OneToOne(mappedBy = "user",cascade =  CascadeType.ALL,fetch = FetchType.LAZY)
    private Patient patient;
    
    @Transient
    @OneToOne(mappedBy = "user",cascade =  CascadeType.ALL,fetch = FetchType.LAZY)
    private Staff staff;

    private String image;
    
    public User(UserDto userDto) {
    	if(userDto.getId()!=null){
    		this.id=userDto.getId();
    	}
    	this.username = userDto.getUsername();
		this.name = userDto.getName();
		this.email = userDto.getEmail();
		this.phone = userDto.getPhone();
		this.effectiveFrom = userDto.getEffectiveFrom();
		this.effectiveTo= userDto.getEffectiveTo();
        this.image=userDto.getImage();
		
	}
    


    public User(String email, String phone) {
        this.email = email;
        if(phone != null && !phone.equals("")) {
            this.phone = phone;
        }
    }
}
