package com.jee.clinichub.app.admin.clinic.allclinic.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicProj;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicPublicViewProj;

@Repository
public interface ClinicRepository  extends JpaRepository<Clinic,Long>{


@Query("SELECT c FROM Clinic c WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))")
List<Clinic> filterByname(String name);

@Query(value = "SELECT * FROM clinic_public_view v " +
       "WHERE (:searchKey IS NULL OR " +
       "LOWER(v.clinic_name) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
       "LOWER(v.clinic_type_name) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
       "LOWER(v.branches) LIKE LOWER(CONCAT('%', :searchKey, '%')))",
       countQuery = "SELECT count(*) FROM clinic_public_view v " +
       "WHERE (:searchKey IS NULL OR " +
       "LOWER(v.clinic_name) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
       "LOWER(v.clinic_type_name) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
       "LOWER(v.branches) LIKE LOWER(CONCAT('%', :searchKey, '%')))",
       nativeQuery = true)
Page<ClinicPublicViewProj> filterClinicPublicView(Pageable pageable, @Param("searchKey") String searchKey);

Optional<Clinic> findBySlug(String slug);

    
}
