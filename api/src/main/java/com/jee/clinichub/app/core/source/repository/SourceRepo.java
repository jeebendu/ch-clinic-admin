package com.jee.clinichub.app.core.source.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.source.model.Source;



@Repository
public interface SourceRepo extends JpaRepository<Source,Long>{

    boolean findByNameIgnoreCaseAndIdNot(String name, long l);

   

    boolean existsByNameIgnoreCase(String name);
    

    
}
