package com.jee.clinichub.app.user.model;

import org.hibernate.annotations.DynamicUpdate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.user.role.model.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "users",uniqueConstraints = { 
		@UniqueConstraint(columnNames = "username"),
		@UniqueConstraint(columnNames = "phone"),
		@UniqueConstraint(columnNames = "email")})
public class UserAuth {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    

    @OneToOne
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;

    @Column
    private String username;

    @Column
    @JsonIgnore
    private String password;

    @Column
    private String email;

    @Column
    private String phone;

    @Column
    private String name;
    
    @OneToOne(fetch = FetchType.EAGER)
   	@JoinColumn(name = "role_id", nullable = false)
   	private Role role;

    //@Column(name = "is_verified")
	//public boolean isVerified=false;
   
  /*  @ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(	name = "user_roles", 
				joinColumns = @JoinColumn(name = "user_id"), 
				inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();
    */
    
    
}