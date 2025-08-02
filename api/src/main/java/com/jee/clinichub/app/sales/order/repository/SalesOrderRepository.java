package com.jee.clinichub.app.sales.order.repository;

import java.util.Date;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.sales.order.model.SalesOrder;
import com.jee.clinichub.app.sales.order.model.SalesOrderProj;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

	List<SalesOrderProj> findAllProjectedBy();

	@Cacheable(value = "salesOrderCache", keyGenerator = "multiTenantCacheKeyGenerator")
	List<SalesOrderProj> findAllProjectedByBranch_IdOrderByIdDesc(Long branchId);

    @Cacheable(value = "salesOrderCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @Query("SELECT s FROM SalesOrder s " +
        "WHERE s.branch.id = :branchId " +
        "AND (:paymentId IS NULL OR s.paymentType.id = :paymentId) " +
        "AND ((:name IS NULL OR :name = '' OR LOWER(s.customer.firstName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
        "OR (:name IS NULL OR :name = '' OR LOWER(s.customer.lastName) LIKE LOWER(CONCAT('%', :name, '%')))) " +
        // "AND (:fromDate IS NULL OR s.createdTime >= :fromDate)  " +
        // "AND (:toDate IS NULL OR s.createdTime <= :toDate) " +
        "ORDER BY s.id DESC")
    Page<SalesOrderProj> search(
        Pageable pr,
        @Param("branchId") Long branchId,
        @Param("name") String name,
        // @Param("fromDate") Date fromDate,
        // @Param("toDate") Date toDate,
        @Param("paymentId") Long paymentId);
}