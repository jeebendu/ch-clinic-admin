package com.jee.clinichub.app.doctor.medical_college.repository;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollege;

@Repository
public interface MedicalCollegeRepo extends JpaRepository<MedicalCollege, Long>{

    boolean existsByNameIgnoreCaseAndIdNot(String name, long l);

    @Query("SELECT mc FROM MedicalCollege mc WHERE (:name IS NULL OR LOWER(TRIM(mc.name)) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<MedicalCollege> filterAllByName(@Param("name") String name);

    
}
