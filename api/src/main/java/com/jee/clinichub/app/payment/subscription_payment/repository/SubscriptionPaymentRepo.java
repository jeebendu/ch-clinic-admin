package com.jee.clinichub.app.payment.subscription_payment.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentProj;



@Repository
public interface SubscriptionPaymentRepo extends JpaRepository<SubscriptionPayment, Long> {

    @Query("SELECT s FROM SubscriptionPayment s")
    Page<SubscriptionPaymentProj> findAllPaymentHistrory(Pageable pageable);

    Page<SubscriptionPaymentProj> findAllByCreatedTimeGreaterThanEqual(Date fromDate, Pageable pageable);
    Page<SubscriptionPaymentProj> findAllByCreatedTimeLessThanEqual(Date toDate, Pageable pageable);
    Page<SubscriptionPaymentProj> findAllByCreatedTimeBetween(Date fromDate, Date toDate,Pageable pageable);
    
    Optional<SubscriptionPayment> findFirstByTenant_idAndStartDateBeforeAndEndDateAfterOrderByStartDateDesc(
    Long clinicId, Date currentDate1, Date currentDate2
);

    List<SubscriptionPayment> findAllByTenant_id(Long id);

}
