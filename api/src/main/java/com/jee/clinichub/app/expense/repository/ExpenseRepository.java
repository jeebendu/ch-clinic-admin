package com.jee.clinichub.app.expense.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.expense.model.Expense;
import com.jee.clinichub.app.expense.model.ExpenseProj;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<ExpenseProj> findAllProjectedBy();

	@Cacheable(value = "expenseCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<ExpenseProj> findAllProjectedByBranch_IdOrderByIdDesc(Long branchId);
	
	@Cacheable(value = "expenseCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT e FROM Expense e " +
	"WHERE e.branch.id = :branchId " +
	"AND (:paymentTypeId IS NULL OR e.paymentType.id = :paymentTypeId) " +
	"AND (:approved IS NULL OR e.approved = CASE WHEN :approved = 1 THEN true ELSE false END) " +
	"AND (:approvedById IS NULL OR e.approvedBy.id = :approvedById) " +
	// "AND (:submitedByName IS NULL OR LOWER(e.createdBy) LIKE LOWER(CONCAT('%', :submitedByName, '%'))) " +
	"ORDER BY e.id DESC")
    Page<ExpenseProj> search(
	         Pageable pageable,
            @Param("branchId") Long branchId,
            @Param("paymentTypeId") Long paymentTypeId,
            @Param("approved") Long approved,
            @Param("approvedById") Long approvedById
            // @Param("submitedByName") String submitedByName
		);
  
}
