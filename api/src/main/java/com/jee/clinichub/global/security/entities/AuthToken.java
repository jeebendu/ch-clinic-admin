package com.jee.clinichub.global.security.entities;

import java.util.Set;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.user.role.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthToken {
   private Long id;
    private String token;
    private Long branchId;
    private Set<Long> BranchIds;
    private String name;
    private String username;
    private String role;
    private Role roleobj;


}