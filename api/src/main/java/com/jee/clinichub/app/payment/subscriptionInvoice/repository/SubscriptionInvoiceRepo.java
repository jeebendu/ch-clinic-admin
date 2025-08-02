package com.jee.clinichub.app.payment.subscriptionInvoice.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jee.clinichub.app.payment.subscriptionInvoice.model.SubscriptionInvoice;
public interface SubscriptionInvoiceRepo  extends JpaRepository<SubscriptionInvoice,Long>{

    List<SubscriptionInvoice> findAllByTenant_id(Long tenantId);
    
    
}
