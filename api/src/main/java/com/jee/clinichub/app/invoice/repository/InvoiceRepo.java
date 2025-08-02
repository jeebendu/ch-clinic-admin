package com.jee.clinichub.app.invoice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.invoice.model.Invoice;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice,Long>{

    List<Invoice> findAllByVisit_id(Long id);

    List<Invoice> findAllByVisit_patient_id(Long patientId);
    
}
