package com.jee.clinichub.app.branch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchMaster;

@Repository
public interface BranchMasterRepository extends JpaRepository<BranchMaster, Long>, RevisionRepository<BranchMaster, Long, Long> {
	
	Optional<BranchMaster> findBranchByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    Branch findBranchById(Long branchId);


    @Query("SELECT b FROM Branch b ORDER BY b.id ASC")
    Optional<BranchMaster> findTopByOrderByIdAsc();

	Optional<BranchMaster> findByGlobalBranchId(UUID globalBranchId);

    List<BranchMaster> findAllByClinicMaster_id(Long id);

    @Query("SELECT bm FROM BranchMaster bm WHERE (:name IS NULL OR LOWER(bm.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND bm.code='CHUB'")
    List<BranchMaster> filterBranchMaster(String name);

	
}