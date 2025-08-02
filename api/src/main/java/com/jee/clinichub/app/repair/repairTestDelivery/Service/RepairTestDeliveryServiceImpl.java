package com.jee.clinichub.app.repair.repairTestDelivery.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateList;
import com.jee.clinichub.app.repair.repairTestDelivery.Repository.RepairTestDeliveryRepository;
import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDelivery;
import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDeliveryDto;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.global.model.Status;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RepairTestDeliveryServiceImpl implements RepairTestDeliveryService{
    @Autowired RepairTestDeliveryRepository repairTestDeliveryRepository;

    @Override
    public List<RepairTestDeliveryDto> getAll() {
        List<RepairTestDeliveryDto> repairTestDeliveryDtoList=new ArrayList<>();
        try {
           
            List<RepairTestDelivery> repairTestDeliveryList = repairTestDeliveryRepository.findAll();
           repairTestDeliveryDtoList=repairTestDeliveryList.stream().map(RepairTestDeliveryDto::new).toList();
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            
    }
        
        return repairTestDeliveryDtoList;
}

    @Override
    public Status saveOrUpdate(RepairTestDeliveryDto repairTestDeliveryDto) {
          try{
			
            
                
            RepairTestDelivery repairTestDelivery = new RepairTestDelivery();
                
                if(repairTestDeliveryDto.getId()==null) {
                    repairTestDelivery = new RepairTestDelivery(repairTestDeliveryDto);
                }else{
                    repairTestDelivery = this.update(repairTestDeliveryDto);
                }
                
                repairTestDelivery = repairTestDeliveryRepository.save(repairTestDelivery);
                return new Status(true,( (repairTestDeliveryDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
            }catch(Exception e){
                log.error(e.getLocalizedMessage());
            }
            return new Status(false,"Something went wrong");
    }

    private RepairTestDelivery update(RepairTestDeliveryDto repairTestDeliveryDto) {
        RepairTestDelivery repairTestDelivery = new RepairTestDelivery();
        try {
            Optional<RepairTestDelivery> repairTestDeliveryOpt = repairTestDeliveryRepository.findById(repairTestDeliveryDto.getId());
            if (repairTestDeliveryOpt.isPresent()) {
                 repairTestDelivery=repairTestDeliveryOpt.get();
                repairTestDelivery.setHearingAddCheckedBy(new Staff(repairTestDeliveryDto.getHearingAddCheckedBy()));
                repairTestDelivery.setCheckDate(repairTestDeliveryDto.getCheckDate());
                repairTestDelivery.setInformedToPatientBy(new Staff(repairTestDeliveryDto.getInformedToPatientBy()));
                repairTestDelivery.setInformedDate(repairTestDeliveryDto.getInformedDate());
                repairTestDelivery.setRecievedBy(repairTestDeliveryDto.getRecievedBy());
                repairTestDelivery.setRecievedDate(repairTestDeliveryDto.getRecievedDate());
                repairTestDelivery.setGivenBy(new Staff(repairTestDeliveryDto.getGivenBy()));
                repairTestDelivery.setGivenDate(repairTestDeliveryDto.getGivenDate());
            }
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return repairTestDelivery;
    }

    @Override
    public Status delete(Long id) {
      try {
        Optional<RepairTestDelivery> repairTestDelivery = repairTestDeliveryRepository.findById(id);
        if (!repairTestDelivery.isPresent()) {
            return new Status(false, "Not Found");
        }

        
            repairTestDeliveryRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
            
        } catch (Exception e) {
            return new Status(false, e.getLocalizedMessage());
        }
    }

    @Override
    public RepairTestDeliveryDto getById(Long id) {
        RepairTestDeliveryDto repairTestDeliveryDto = new RepairTestDeliveryDto();
        try {
            Optional<RepairTestDelivery> repairTestDelivery = repairTestDeliveryRepository.findById(id);
            if (repairTestDelivery.isPresent()) {
                repairTestDeliveryDto = new RepairTestDeliveryDto(repairTestDelivery.get());
            }
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
    }
    return repairTestDeliveryDto;
    
}

	@Override
	public RepairTestDeliveryDto getByRId(Long id) {
		 RepairTestDeliveryDto repairTestDeliveryDto = new RepairTestDeliveryDto();
	        try {
	            Optional<RepairTestDelivery> repairTestDelivery = repairTestDeliveryRepository.findByRepair_id(id);
	            if (repairTestDelivery.isPresent()) {
	                repairTestDeliveryDto = new RepairTestDeliveryDto(repairTestDelivery.get());
	            }
	        } catch (Exception e) {
	            log.error(e.getLocalizedMessage());
	    }
	    return repairTestDeliveryDto;
	}
}
