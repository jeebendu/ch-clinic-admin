package com.jee.clinichub.app.payment.subscriptionInvoice.service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.payment.subscriptionInvoice.model.SubscriptionInvoice;
import com.jee.clinichub.app.payment.subscriptionInvoice.model.SubscriptionInvoiceDto;
import com.jee.clinichub.app.payment.subscriptionInvoice.model.TenantPayment;
import com.jee.clinichub.app.payment.subscriptionInvoice.repository.SubscriptionInvoiceRepo;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.model.Tenant;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionInvoiceServiceImpl implements SubscriptionInvoiceService {

    private final SubscriptionInvoiceRepo subscriptionInvoiceRepo;

    @Override
    public List<SubscriptionInvoiceDto> getAll() {
        List<SubscriptionInvoice> subscriptionInvoice = subscriptionInvoiceRepo.findAll();
        return subscriptionInvoice.stream().map(SubscriptionInvoiceDto::new).collect(Collectors.toList());
    }

    @Override
    public SubscriptionInvoiceDto getById(Long id) {
        Optional<SubscriptionInvoice> subscriptionInvoice = subscriptionInvoiceRepo.findById(id);
        if (subscriptionInvoice.isPresent()) {
            return new SubscriptionInvoiceDto(subscriptionInvoice.get());
        }
        throw new RuntimeException("SubscriptionInvoice not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(SubscriptionInvoiceDto subscriptionInvoiceDto) {
        try {
            SubscriptionInvoice subscriptionInvoice = subscriptionInvoiceDto.getId() == null
                    ? new SubscriptionInvoice(subscriptionInvoiceDto)
                    : setSubscriptionInvoice(subscriptionInvoiceDto);
            subscriptionInvoiceRepo.save(subscriptionInvoice);
            return new Status(true, (subscriptionInvoiceDto.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to save or update SubscriptionInvoice: " + e.getMessage());
        }
    }

    public SubscriptionInvoice setSubscriptionInvoice(SubscriptionInvoiceDto subscriptionInvoiceDto) {
        SubscriptionInvoice existingSubscriptionInvoice = subscriptionInvoiceRepo.findById(subscriptionInvoiceDto.getId())
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("SubscriptionInvoice Not Found With Id: " + subscriptionInvoiceDto.getId());
                });
        existingSubscriptionInvoice.setTenant(new Tenant(subscriptionInvoiceDto.getTenant()));
        existingSubscriptionInvoice.setTotalAmount(subscriptionInvoiceDto.getTotalAmount());
        existingSubscriptionInvoice.setPaidAmount(subscriptionInvoiceDto.getPaidAmount());
        existingSubscriptionInvoice.setStatus(subscriptionInvoiceDto.getStatus());
        existingSubscriptionInvoice.setPaymentType(subscriptionInvoiceDto.getPaymentType());
        
        TenantPayment expayment=existingSubscriptionInvoice.getPayment();
        expayment.setAmount(existingSubscriptionInvoice.getPayment().getAmount());
        expayment.setPaidOn(existingSubscriptionInvoice.getPayment().getPaidOn());
        expayment.setPaymentType(existingSubscriptionInvoice.getPayment().getPaymentType());

       

        existingSubscriptionInvoice.setPayment(expayment);
        return existingSubscriptionInvoice;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<SubscriptionInvoice> subscriptionInvoice = subscriptionInvoiceRepo.findById(id);
            if (!subscriptionInvoice.isPresent()) {
                return new Status(false, "SubscriptionInvoice not found with ID: " + id);
            }
            subscriptionInvoiceRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete SubscriptionInvoice: " + e.getMessage());
        }
    }

    @Override
    public List<SubscriptionInvoiceDto> findAllByTenantId(Long tenantId) {
        return subscriptionInvoiceRepo.findAllByTenant_id(tenantId).stream().map(SubscriptionInvoiceDto::new)
                .collect(Collectors.toList());
    }

}
