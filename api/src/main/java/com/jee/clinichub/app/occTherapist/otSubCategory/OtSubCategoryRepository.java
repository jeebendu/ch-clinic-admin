package com.jee.clinichub.app.occTherapist.otSubCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;

@Repository
public interface OtSubCategoryRepository extends JpaRepository<OtSubCategory, Long> {

	List<OtSubCategory> findAllByCategory_id(Long categoryId);
    


}