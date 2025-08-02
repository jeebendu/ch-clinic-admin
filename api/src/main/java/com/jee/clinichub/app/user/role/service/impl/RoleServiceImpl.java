package com.jee.clinichub.app.user.role.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.app.user.role.permission.model.Permission;
import com.jee.clinichub.app.user.role.repository.PermRepository;
import com.jee.clinichub.app.user.role.repository.RoleeRepository;
import com.jee.clinichub.app.user.role.service.RoleService;
import com.jee.clinichub.global.model.Status;

@Service(value = "roleService")
public class RoleServiceImpl implements RoleService {
	
	private static final Logger log = LoggerFactory.getLogger(RoleService.class);

    @Autowired
     RoleeRepository roleRepository;
    
    @Autowired
    PermRepository permissionRepository;
    
	@Override
	public Status saveOrUpdate(RoleDto roleDto) {
		try{
			
			boolean isExist = (roleDto.getId()==null) ? roleRepository.existsByName(roleDto.getName()): roleRepository.existsByNameAndIdNot(roleDto.getName(),roleDto.getId());
			
			if(isExist){
	    		return new Status(false,"Role name already exist");
	    	}
			
			Role role = new Role();
			if(roleDto.getId()==null) {
				role = new Role(roleDto);
			}else{
				role = this.setRole(roleDto);
			}
			roleRepository.save(role);
			
			return new Status(true,((roleDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Role setRole(RoleDto roleDto) {
    	Role role = roleRepository.findById(roleDto.getId()).get();
    	role.setName(roleDto.getName());
    	
    	List<Permission> permissions = new ArrayList<Permission>();
    	roleDto.getPermissions().forEach(item->{
    		Permission permission = new Permission(item);
    		//permission.setRead(item.isRead());
    		//permission.setWrite(item.isWrite());
    		permission.setPrint(item.isPrint());
    		permission.setUpload(item.isUpload());
    		permission.setRole(role);
    		permissions.add(permission);
		});
    	role.setPermissions(permissions);
    	
		return role;
		
	}

	/*@Override
  	public List<RoleDto> getAllRoles() {
    	List<Role> roleList = roleRepository.findAll();
    	List<RoleDto> roleDtoList = roleList.stream().map(RoleDto::new).collect(Collectors.toList());
  		return roleDtoList;
  	}
	*/
    
	@Override
  	public List<CommonProj> getAllRoles() {
    	List<CommonProj> roleList = roleRepository.findAllProjectedBy();
  		return roleList;
  	}
	
	@Override
  	public List<CommonProj> getAllRolesByType(String type) {
		List<CommonProj> roleList = new ArrayList<>();
		if(type!=null){
			if(type.equalsIgnoreCase("user-creation")){
				List<String> names = new ArrayList<>();
				names.add("Doctor");
				names.add("Patient");
				roleList = roleRepository.findAllProjectedByNameNotIn(names);
			}else if(type.equalsIgnoreCase("role")){
				roleList = roleRepository.findAllProjectedByIsDisplay(true);
			}
		}else{
			roleList = roleRepository.findAllProjectedBy();
		}
    	
  		return roleList;
  	}
	

    @Override
    public Role findByName(String name) {
        Role role = roleRepository.findRoleByName(name);
        return role;
    }
    
    
    
    
	@Override
	public RoleDto getById(Long id) {
		
		RoleDto roleDto = new RoleDto();
		try{
			Optional<Role> role = roleRepository.findById(id);
			if(role.isPresent()){
				roleDto = new RoleDto(role.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		
		return roleDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Role> role = roleRepository.findById(id);
			
			if(!role.isPresent()){
				return new Status(false,"Role Not Found");
			}
			//String[] roleList = {"Admin","Doctor","Patient","Staff"};
			//if(Arrays.asList(roleList).contains(role.get().getName()) ){}
			
			if(role.get().isDefault()){
				return new Status(false,"Cannot remove Default Role");
			}
			
			roleRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
			
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}
