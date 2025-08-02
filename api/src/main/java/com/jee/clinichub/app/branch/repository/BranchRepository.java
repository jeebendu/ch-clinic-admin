
package com.jee.clinichub.app.branch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchMaster;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long>, RevisionRepository<Branch, Long, Long> {

    Optional<Branch> findBranchByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    Branch findBranchById(Long branchId);

    @Query("SELECT b FROM Branch b ORDER BY b.id ASC")
    Optional<Branch> findTopByOrderByIdAsc();

    Optional<Branch> findFirstByOrderByIdAsc();

    Optional<Branch> findByPrimary(boolean b);

    boolean existsByPrimaryAndIdNot(boolean b, long l);

    Optional<Branch> findByGlobalBranchId(@Param("globalBranchId") UUID globalBranchId);

    boolean existsByGlobalBranchId(@Param("globalBranchId") UUID globalBranchId);

    // New method to explicitly find a branch by ID
    @Query("SELECT b FROM Branch b WHERE b.id = :id")
    Optional<Branch> findOneById(@Param("id") Long id);

    Optional<Branch> findOneByPrimary(boolean b);

	Optional<Branch> findByCode(String code);

	Optional<Branch> findOneByPrimaryAndCode(boolean b, String string);

	Optional<Branch> findFirstByClinicIsNullOrderByIdAsc();

       @Query("SELECT bm FROM Branch bm WHERE (:name IS NULL OR LOWER(bm.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND bm.primary=false")
    List<Branch> filterBranchMaster(String name);

}

