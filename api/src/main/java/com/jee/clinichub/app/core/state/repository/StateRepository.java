package com.jee.clinichub.app.core.state.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.core.state.model.State;




public interface StateRepository extends JpaRepository<State,Long>{

  

    boolean existsByNameIgnoreCase(String name);

   

    List<State> findAllByCountry_id(Long cid);

  
    
}
