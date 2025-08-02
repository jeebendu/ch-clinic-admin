package com.jee.clinichub.app.core.district.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.core.district.repository.DistrictRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class DistrictServiceImpl implements DistrictService {

    @Autowired
    DistrictRepository districtRepository;

    @Override
    public DistrictDto getById(Long id) {

    return districtRepository.findById(id).map(DistrictDto::new)
    .orElseThrow(() -> new EntityNotFoundException("district not found with ID: " + id));

    }

     @Override
    public Status deleteById(Long id) {
        districtRepository.findById(id).ifPresentOrElse(
                district ->{
                    districtRepository.deleteById(id);
                },
                ()->{
                    throw new EntityNotFoundException("district not found with ID: "+id);
                });
            return new Status(true, "Deleted Successfully");
            
        }


        @Override
    public Status saveOrUpdate( DistrictDto districtDto) {
        try{
            boolean nameExists = districtRepository.existsByNameIgnoreCase(districtDto.getName());
    
            if (nameExists) {
                return new Status(false, "district already exists");
            }
    
            District district = districtDto.getId() == null ? new District(districtDto) : this.setDistrict(districtDto);
            districtRepository.save(district);
                return new Status(true, districtDto.getId() == null ? "Added Successfully" : "Updated Successfully");
            } 
            
            catch (Exception e) 
            {
                log.error("Error saving or updating district: {}", e.getMessage(), e);
                return new Status(false, "An error occurred");
            }
       

    }

   
    private District setDistrict(DistrictDto districtDto) {
		return districtRepository.findById(districtDto.getId())
				.map(existingDistrict -> {
					existingDistrict.setName(districtDto.getName());
					return existingDistrict;
				}).orElseThrow(() -> new EntityNotFoundException("district not found with ID: " + districtDto.getId()));
	}

@Override
    public List<DistrictDto> findAll() {
        return districtRepository.findAll().stream().map(DistrictDto::new).toList();
        }

@Override
public List<DistrictDto> getByState_id(Integer id) {
    return districtRepository.findAllByState_id(id).stream().map(DistrictDto::new).toList();
}

@Override
public List<DistrictDto> filterByName(String name) {
    List<DistrictDto> districtDtos=new ArrayList<DistrictDto>();
  try {
    if(name!=null && !name.equals("")){
        districtDtos=districtRepository.findAllByNameContainingIgnoreCase(name).stream().map(DistrictDto::new).toList();
    }
  } catch (Exception e) {
    log.error("Something went wrong while fetching district list");
  }
  return districtDtos;
}




    
}
