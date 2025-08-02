package com.jee.clinichub.app.occTherapist.otChildrenChecklistMap;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.occTherapist.children.Children;

@Repository
public interface OtChildrenChecklistMapRepository extends JpaRepository<OtChildrenChecklistMap , Long>{

	List<OtChildrenChecklistMap> findByChildren_id(Long id);

	OtChildrenChecklistMap findTop1ByChildren_idAndChecklist_subcategory_idOrderByDateDesc(Long childrenId , Long subcategoryId);
}
