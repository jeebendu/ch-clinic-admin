package com.jee.clinichub.app.repair.RepairCompany;

import java.util.List;
import java.util.Optional;

import com.jee.clinichub.global.model.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service(value = "repairCompanyService")
public class RepairCompanyServiceimpl implements RepairComapanyService{
    
    private static final Logger log = LoggerFactory.getLogger(RepairCompanyServiceimpl.class);

    @Autowired
    private RepairCompanyRepository repairCompanyRepository;

    @Override
    public List<RepairCompany> getAll() {
       
        List<RepairCompany> rList =  repairCompanyRepository.findAll();
        return rList;
    }

    @Override
    public RepairCompany getById(Long id) {
        RepairCompany repairCompany=repairCompanyRepository.findById(id).get();
        return repairCompany;
    }

    @Override
    public Status deleteById(Long id) {
        try{
			Optional<RepairCompany> repairCompany = repairCompanyRepository.findById(id);
			if(!repairCompany.isPresent()){
				return new Status(false,"Repair Company Not Found");
			}
			
			repairCompanyRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
        
    }

    @Override
    public Status saveOrUpdate(RepairCompanyDto repairDto) {
       
        try{
        	boolean isExist = false;
        	if(repairDto.getId()==null) {
        		isExist = repairCompanyRepository.existsByName(repairDto.getName());
        	}else {
        		isExist = repairCompanyRepository.existsByNameAndIdNot(repairDto.getName(),repairDto.getId());
        	}
        	
        	if(isExist) {
        		return new Status(false, "Company name already exists.");
        	}
			RepairCompany repairCompany = new RepairCompany(repairDto);
            repairCompanyRepository.save(repairCompany);
            
			
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
			return new Status(false, "Something WentWrong, please Try Again.");
		}
        return new Status(true, "Saved Successfully.");
        
        
    }

    

}
