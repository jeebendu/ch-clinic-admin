package com.jee.clinichub.app.doctor.doctorServiceMap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.doctorServiceMap.model.DoctorServiceMap;

@Repository
public interface DoctorServiceMapRepo extends JpaRepository<DoctorServiceMap, Long> {

    List<DoctorServiceMap> findAllByDoctorBranch_id(Long id);

    Optional<DoctorServiceMap> findAllByDoctorBranch_doctor_idAndDoctorBranch_branch_id(Long doctorBranchId,
            Long branchId);

    // DoctorServiceMapRepository.java
    @Query(value = """
            SELECT DISTINCT ON (dsm.service_type_id) dsm.*          
            FROM   doctor_service_map dsm
                   JOIN doctor_branch db ON db.id = dsm.doctor_branch_id
            WHERE  db.doctor_id = :doctorId
            ORDER  BY dsm.service_type_id,              
                      dsm.id                           
            """, nativeQuery = true)
    List<DoctorServiceMap> findUniqueByDoctorId(@Param("doctorId") Long doctorId);

    // List<DoctorServiceMap> findAllByDoctorBranch_doctor_id(Long id);

}
