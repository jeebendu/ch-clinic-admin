package com.jee.clinichub.app.occTherapist.children;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChildrenRepository extends JpaRepository<Children , Long> {
    


}
