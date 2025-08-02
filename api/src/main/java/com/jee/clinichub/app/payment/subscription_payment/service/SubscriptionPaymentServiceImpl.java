package com.jee.clinichub.app.payment.subscription_payment.service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.app.payment.subscription_payment.model.PaymentExplorationSearch;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentDto;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentProj;
import com.jee.clinichub.app.payment.subscription_payment.repository.SubscriptionPaymentRepo;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionPaymentServiceImpl implements SubscriptionPaymentService {

    @Autowired
    private SubscriptionPaymentRepo subscriptionPaymentRepo;

    @Autowired
    TenantService tenantService;

    @Autowired
    TemplateEngine htmlTemplateEngine;

    @Autowired
    FileService fileService;

    @Autowired
    TypeConverter typeConverter;

    @Override
    public SubscriptionPaymentDto getById(Long id) {
        return subscriptionPaymentRepo.findById(id).map(SubscriptionPaymentDto::new).orElseThrow(() -> {
            throw new EntityNotFoundException("subscription Payment request data not found with id :" + id);
        });
    }

    @Override
    public Page<SubscriptionPaymentProj> getAllPaymentHistory(PaymentExplorationSearch search, Pageable pageable) {

        Date fromDate = search.getFromDate() != null ? search.getFromDate() : null;
        Date toDate = search.getToDate() != null ? search.getToDate() : null;

        if (search.getFromDate() == null && search.getToDate() == null) {
            return subscriptionPaymentRepo.findAllPaymentHistrory(pageable);

        } else if (fromDate != null && toDate == null) {

            return subscriptionPaymentRepo.findAllByCreatedTimeGreaterThanEqual(fromDate, pageable);

        } else if (fromDate == null && toDate != null) {
            return subscriptionPaymentRepo.findAllByCreatedTimeLessThanEqual(toDate, pageable);
        }
        return subscriptionPaymentRepo.findAllByCreatedTimeBetween(fromDate, toDate, pageable);

    }

    @Override
    public byte[] downloadPaymentHistory(Long id) {
        try {
            SubscriptionPaymentDto payment = subscriptionPaymentRepo.findById(id).map(SubscriptionPaymentDto::new)
                    .orElseThrow(() -> {
                        throw new EntityNotFoundException("subscription Payment request data not found with id :" + id);
                    });

            String html = generateAudiometryHtml(payment);
            File tempFile = File.createTempFile("prescription", ".pdf");
            FileOutputStream fos = new FileOutputStream(tempFile);
            ConverterProperties converterProperties = new ConverterProperties();
            // converterProperties.setBaseUri(getBaseUri());
            HtmlConverter.convertToPdf(html, fos, converterProperties);

            byte[] pdfBytes = typeConverter.fileToByteArray(new File(tempFile.getPath()));
            return pdfBytes;
            // return new Status(true, ((prescription.getId() == null) ? "Added" :
            // "Updated") + " Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return null;
    }

    private String generateAudiometryHtml(SubscriptionPaymentDto payment) {
        try {

            final Context ctx = new Context(LocaleContextHolder.getLocale());

            String tenantId = TenantContextHolder.getCurrentTenant();
            Tenant tenant = tenantService.findByTenantId(tenantId);
            String tenantLogoUrl = fileService.getSecureUrl(tenant.getLogo(), true, tenantId);

            String host = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            ctx.setVariable("cssurl", host + "/css/patient/audiogram/style.css");
            ctx.setVariable("clinicForm", "Patient Bill Receipt");
            ctx.setVariable("clinicName", tenant.getTitle());
            ctx.setVariable("clinicLogo", tenantLogoUrl);

            ctx.setVariable("payment", payment);

            final String htmlContent = this.htmlTemplateEngine.process("/patient/appointment/paymenthistory.html", ctx);
            return htmlContent;

        } catch (Exception e) {
           log.error("Something went wrong", e);
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SubscriptionPaymentDto> getAllByTenantId(Long id) {
        return subscriptionPaymentRepo.findAllByTenant_id(id).stream().map(SubscriptionPaymentDto::new).toList();
    }

    @Override
    public SubscriptionPaymentDto getActivePlan(Long id) {
        Date currentDate = new Date();
        SubscriptionPaymentDto subscriptionPaymentDto = new SubscriptionPaymentDto();
        try {
            Optional<SubscriptionPayment> subscriptionPayment = subscriptionPaymentRepo
                    .findFirstByTenant_idAndStartDateBeforeAndEndDateAfterOrderByStartDateDesc(id, currentDate,
                            currentDate);
            if (subscriptionPayment.isPresent()) {
                subscriptionPaymentDto = new SubscriptionPaymentDto(subscriptionPayment.get());
            } else {
                throw new EntityNotFoundException("No active plan found for tenant with id: " + id);
            }
            return subscriptionPaymentDto;
        } catch (Exception e) {
            log.error("Error fetching active plan for tenant with id {}: {}", id, e.getMessage());
            return null;
        }
    }

}
