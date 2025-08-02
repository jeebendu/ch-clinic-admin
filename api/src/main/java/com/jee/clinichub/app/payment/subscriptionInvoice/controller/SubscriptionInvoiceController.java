package com.jee.clinichub.app.payment.subscriptionInvoice.controller;
import java.util.List;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.app.payment.subscriptionInvoice.model.SubscriptionInvoiceDto;
import com.jee.clinichub.app.payment.subscriptionInvoice.service.SubscriptionInvoiceService;
import com.jee.clinichub.global.model.Status;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping
@RequiredArgsConstructor

public class SubscriptionInvoiceController {

    private final SubscriptionInvoiceService subscriptionInvoiceService;

     @GetMapping(value = "/list")
    public List<SubscriptionInvoiceDto> getAll() {
        return subscriptionInvoiceService.getAll();
    }

    @GetMapping(value = "/id/{id}")
    public SubscriptionInvoiceDto getById(@PathVariable Long id) {
        return subscriptionInvoiceService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid SubscriptionInvoiceDto invoiceDTO, HttpServletRequest request, Errors errors) {
        return subscriptionInvoiceService.saveOrUpdate(invoiceDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return subscriptionInvoiceService.deleteById(id);
    }


     @GetMapping(value = "/tenant-id/{tenantId}")
    public List<SubscriptionInvoiceDto> findAllByTenantId(@PathVariable Long tenantId) {
        return subscriptionInvoiceService.findAllByTenantId(tenantId);
    }

}
