package com.jee.clinichub.app.occTherapist.otCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;

@Repository
public interface OtCategoryRepository extends JpaRepository<OtCategory, Long> {
    


}