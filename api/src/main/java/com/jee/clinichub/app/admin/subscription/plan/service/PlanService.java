package com.jee.clinichub.app.admin.subscription.plan.service;

import java.util.List;

import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.global.model.Status;




public interface PlanService {

    List<PlanDto> getAllPlans();

    PlanDto getById(Long id);

     Status saveOrUpdate(PlanDto plan);

    Status deleteById(Long id);

    Status changeStatus( Long id);


   



}
