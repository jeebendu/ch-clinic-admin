package com.jee.clinichub.app.admin.subscription.plan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
@Repository
public interface PlanRepository  extends JpaRepository<Plan,Long> {
    // boolean existsByNameAndIdNot(String name, Long id);   
}
