package com.jee.clinichub.app.payment.transaction.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.payment.transaction.model.PaymentTransaction;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

	PaymentTransaction findTopByOrderByIdDesc();

	PaymentTransaction findTopByBranch_idOrderByIdDesc(Long id);

	@Cacheable(value = "paymentTransactionCache", keyGenerator = "multiTenantCacheKeyGenerator")
	List<PaymentTransaction> findAllByBranch_id(Long branchId);

	@Cacheable(value = "paymentTransactionCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<PaymentTransactionDto> findPagedProjectedByBranch_idAndPaymentTypeIgnoreCaseContainingOrderByIdDesc(
			Long id, Pageable pr, Long paymentTypeId);

	@Cacheable(value = "paymentTransactionCache", keyGenerator = "multiTenantCacheKeyGenerator")

	// @Query("SELECT p FROM PaymentTransaction p " +
	// 		"WHERE p.branch.id = :branchId " +
	// 		"AND ((:value IS NULL OR LOWER(p.paymentType.name) LIKE LOWER(CONCAT('%', :value, '%'))) " +

	// 		"ORDER BY p.id DESC")

			@Query("SELECT e FROM PaymentTransaction e " +
			"WHERE e.branch.id = :branchId " +
			"AND (:paymentTypeId IS NULL OR e.paymentType.id = :paymentTypeId) " +
			"ORDER BY e.id DESC")
	Page<PaymentTransactionDto> search(
		    Pageable pr,
			@Param("branchId") Long branchId,
			@Param("paymentTypeId") Long paymentTypeId

	);

}