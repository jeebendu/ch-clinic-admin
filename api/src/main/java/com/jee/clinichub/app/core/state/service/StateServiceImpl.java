package com.jee.clinichub.app.core.state.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.app.core.state.repository.StateRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class StateServiceImpl implements StateService{
  
    
    @Autowired
    StateRepository stateRepository;

    @Override
    public StateDto getById(Long id) {

    return stateRepository.findById(id).map(StateDto::new)
    .orElseThrow(() -> new EntityNotFoundException("state not found with ID: " + id));

    }

     @Override
    public Status deleteById(Long id) {
        stateRepository.findById(id).ifPresentOrElse(
                state ->{
                    stateRepository.deleteById(id);
                },
                ()->{
                    throw new EntityNotFoundException("state not found with ID: "+id);
                });
            return new Status(true, "Deleted Successfully");
            
        }


        @Override
    public Status saveOrUpdate( StateDto stateDto) {
        try{
            boolean nameExists = stateRepository.existsByNameIgnoreCase(stateDto.getName());
           
            if (nameExists) {
                return new Status(false, "state already exists");
            }

            State state=new State();
            if(stateDto.getId() == null){
                state=new State(stateDto);
            }
            else{
                state= this.setState(stateDto);
            }
    
              stateRepository.save(state);
                return new Status(true, stateDto.getId() == null ? "Added Successfully" : "Updated Successfully");
            } 
            
            catch (Exception e) 
            {
                log.error("Error saving or updating state: {}", e.getMessage(), e);
                return new Status(false, "An error occurred");
            }
       

    }

    private State setState(StateDto stateDto) {
		return stateRepository.findById(stateDto.getId())
				.map(existingState -> {
					existingState.setName(stateDto.getName());
					return existingState;
				}).orElseThrow(() -> new EntityNotFoundException("state not found with ID: " + stateDto.getId()));
	}

@Override
    public List<StateDto> findAll() {
        return stateRepository.findAll().stream().map(StateDto::new).toList();
        }

@Override
public List<StateDto> getByCountryId(Long cid) {
   try{
    List<State> stateList=stateRepository.findAllByCountry_id(cid);
    List<StateDto> stateDtoList=stateList.stream().map(StateDto::new).toList();
    return stateDtoList;
   }
   catch (Exception e) {
       log.error("Error getting state by country id: {}", e.getMessage(), e);
       return null;
}

}

}
