package com.jee.clinichub.app.core.gender;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategory;

@Repository
public interface GenderRepository extends JpaRepository<Gender, Long>{

	

}
