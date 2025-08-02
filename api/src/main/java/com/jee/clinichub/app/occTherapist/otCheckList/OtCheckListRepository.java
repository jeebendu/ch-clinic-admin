package com.jee.clinichub.app.occTherapist.otCheckList;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;

@Repository
public interface OtCheckListRepository extends JpaRepository<OtCheckList, Long> {

	List<OtCheckList> findAllBySubcategory_id(Long id);

    


}