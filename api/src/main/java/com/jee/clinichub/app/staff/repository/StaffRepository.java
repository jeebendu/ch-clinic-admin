package com.jee.clinichub.app.staff.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.model.StaffProj;
import com.jee.clinichub.app.staff.model.StaffSearch;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<StaffProj> findAllProjectedBy();

    @Cacheable(value = "staffListCache", keyGenerator = "multiTenantCacheKeyGenerator")
    List<StaffProj> findAllProjectedByUser_Branch_Id(Long branchId);

    Page<StaffProj> findPagedProjectedByUser_Branch_idOrderByIdDesc(Long id, Pageable pr);


    Optional<Staff> findByUser_Username(String username);

    Staff findByFirstnameIgnoreCase(String approvedBy);

    @Cacheable(value = "staffListCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @Query("SELECT e FROM Staff e " +
            "WHERE e.user.branch.id = :branchId " +
            "AND (:roleId IS NULL OR e.user.role.id = :roleId) " +
            "AND ( " +
            "(:value IS NULL OR LOWER(e.firstname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
            "OR (:value IS NULL OR LOWER(e.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
            "OR (:value IS NULL OR LOWER(e.user.phone) LIKE LOWER(CONCAT('%', :value, '%'))) " +
            "OR (:value IS NULL OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :value, '%'))) " +
            "OR (:value IS NULL OR LOWER(e.uid) LIKE LOWER(CONCAT('%', :value, '%'))) " +
            ") " +
            // "AND (e.user.effectiveFrom <= :effectiveFrom OR :effectiveFrom IS NULL) " +
            // "AND (e.user.effectiveTo >= :effectiveTo OR :effectiveTo IS NULL) " +
            "ORDER BY e.id DESC")
    Page<StaffProj> filter(Pageable pr,
            @Param("branchId") Long branchId,
            @Param("roleId") Long roleId,
            @Param("value") String value
    // @Param("effectiveFrom") Date effectiveFrom,
    // @Param("effectiveTo") Date effectiveTo

    );

    @Cacheable(value = "staffListCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @Query("SELECT e FROM Staff e " +
                    "WHERE ( " +
                    "(:value IS NULL OR LOWER(e.firstname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
                    "OR (:value IS NULL OR LOWER(e.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
                    "OR (:value IS NULL OR LOWER(e.user.phone) LIKE LOWER(CONCAT('%', :value, '%'))) " +
                    "OR (:value IS NULL OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :value, '%'))) " +
                    "OR (:value IS NULL OR LOWER(e.uid) LIKE LOWER(CONCAT('%', :value, '%'))) " +
                    ") " +
                //     "AND (:status IS NULL OR e.user.role.status = :status) " +
                    // "AND (e.user.effectiveTo >= :effectiveTo OR :effectiveTo IS NULL) " +
                    "ORDER BY e.id DESC")

    Page<StaffProj> findStaffPage(Pageable pr, String value);

    StaffProj findByUser_username(String name);

}