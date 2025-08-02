package com.jee.clinichub.app.payment.subscriptionInvoice.service;
import java.util.List;
import com.jee.clinichub.app.payment.subscriptionInvoice.model.SubscriptionInvoiceDto;
import com.jee.clinichub.global.model.Status;
public interface SubscriptionInvoiceService {
 

    List<SubscriptionInvoiceDto> getAll();

    SubscriptionInvoiceDto getById(Long id);

    Status saveOrUpdate(SubscriptionInvoiceDto subscriptionInvoiceDto);

    Status deleteById(Long id);


    List<SubscriptionInvoiceDto> findAllByTenantId(Long tenantId);
    
}
