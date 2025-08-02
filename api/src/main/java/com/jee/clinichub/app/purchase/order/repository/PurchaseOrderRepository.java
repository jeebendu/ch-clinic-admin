package com.jee.clinichub.app.purchase.order.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.purchase.order.model.PurchaseOrder;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderProj;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

	//List<PurchaseOrderProj> findAllProjectedBy(Long branchId);

	@Cacheable(value = "PurchaseOrderCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<PurchaseOrderProj> findAllProjectedByBranch_idOrderByIdDesc(Long branchId);



	@Cacheable(value = "PurchaseOrderCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @Query("SELECT p FROM PurchaseOrder p " +
        "WHERE p.branch.id = :branchId " +
        "AND (:paymentId IS NULL OR p.paymentType.id = :paymentId) " +
         "AND ((:name IS NULL OR :name = '' OR LOWER(p.vendor.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
        "OR (:name IS NULL OR :name = '' OR LOWER(p.uid) LIKE LOWER(CONCAT('%', :name, '%')))) " +
		"AND (:approved IS NULL OR (p.approved = TRUE AND :approved = 1) OR (p.approved = FALSE AND :approved = 0)) " +
        "ORDER BY p.id DESC")
    Page<PurchaseOrderProj> search(Pageable pr, Long branchId,Long paymentId,String name,Long approved);
  
}