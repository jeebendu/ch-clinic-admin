package com.jee.clinichub.app.appointment.requests.repository;

import java.util.Date;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.requests.model.Request;
import com.jee.clinichub.app.appointment.requests.model.RequestDto;
import com.jee.clinichub.app.appointment.requests.model.RequestProj;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    boolean existsByFirstName(String firstName);

    boolean existsByFirstNameAndIdNot(String firstName, Long id);

    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    Page<RequestProj> findAllByAppointmentDateGreaterThanEqualAndBranch_id(Pageable pageable, @Param("date") Date date,@Param("branchId") Long branchId);
    
    // @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    // @Query("SELECT r FROM Request r " +
    // "WHERE r.branch.id = :branchId " +
    // "AND (:date IS NULL OR r.appointmentDate >= :date) " +
    // "ORDER BY r.id DESC")
    // Page<RequestProj> findAllIfDateNull(Pageable pr, @Param("date") Date date,@Param("branchId") Long branchId );
    
    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    Page<RequestProj> findAllByBranch_id(Pageable pr, Long id);
}
