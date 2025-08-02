package com.jee.clinichub.app.repair.RepairProblemData.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemData;

@Repository
public interface RepairProblemRepository extends JpaRepository<RepairProblemData, Long>{

}
