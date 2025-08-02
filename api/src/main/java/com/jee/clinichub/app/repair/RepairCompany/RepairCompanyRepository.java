package com.jee.clinichub.app.repair.RepairCompany;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairCompanyRepository extends JpaRepository<RepairCompany, Long>{

	

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

    
    
}
