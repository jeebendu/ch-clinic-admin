package com.jee.clinichub.app.core.module.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.branch.context.BranchContextHolder;

@Service(value = "moduleService")
public class ModuleServiceImpl implements ModuleService {
	
	private static final Logger log = LoggerFactory.getLogger(ModuleServiceImpl.class);

    @Autowired
    private ModuleRepository moduleRepository;
    
	 
	@Override
  	public List<CommonProj> getAllModules() {
		Branch branch = BranchContextHolder.getCurrentBranch();
    	List<CommonProj> moduleList = moduleRepository.findAllProjectedByOrderByNameAsc();
  		return moduleList;
  	}

   
	

	
}
