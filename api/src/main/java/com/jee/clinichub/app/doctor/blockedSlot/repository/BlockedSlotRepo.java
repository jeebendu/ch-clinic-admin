package com.jee.clinichub.app.doctor.blockedSlot.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.blockedSlot.model.BlockedSlot;

@Repository
public interface BlockedSlotRepo  extends JpaRepository<BlockedSlot,Long>{



    List<BlockedSlot> findAllByDoctor_idOrderByIdAsc(Long doctorId);

 
}
