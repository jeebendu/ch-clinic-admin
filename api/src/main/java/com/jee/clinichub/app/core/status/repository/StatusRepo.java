package com.jee.clinichub.app.core.status.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.status.model.StatusModel;


@Repository
public interface StatusRepo extends JpaRepository<StatusModel,Long>{

    
    boolean existsByName(String name);
    
}
