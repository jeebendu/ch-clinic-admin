package com.jee.clinichub.app.admin.promo.coupons.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.promo.coupons.model.Coupons;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsProjection;
@Repository
public interface CouponsRepo  extends JpaRepository<Coupons, Long> {


    boolean existsByNameIgnoreCaseAndIdNot(String name, long l); 




    @Query("SELECT c FROM Coupons c WHERE (:discount IS NULL OR c.discount = :discount)" +
  " AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))" +
    " AND (:discountType IS NULL OR c.discountType = :discountType)" +
    " AND (:codee IS NULL OR LOWER(c.codee) LIKE LOWER(CONCAT('%', :codee, '%')))" +
    " AND (:minOrderAmount IS NULL OR c.minOrderAmount >= :minOrderAmount)" +
    " AND (:maxDiscount IS NULL OR c.maxDiscount <= :maxDiscount)" +
    " AND (:limitPerUser IS NULL OR c.limitPerUser = :limitPerUser)")
Page<CouponsProjection> findAdminByNameAndDiscountTypeByCodeAndTime(Pageable pageable,
    @Param("discount") Long discount,
    @Param("name") String name,
    @Param("codee") String codee,
    @Param("discountType") String discountType,
    @Param("minOrderAmount") Long minOrderAmount,
    @Param("maxDiscount") Long maxDiscount,
    @Param("limitPerUser") Integer limitPerUser);

}
