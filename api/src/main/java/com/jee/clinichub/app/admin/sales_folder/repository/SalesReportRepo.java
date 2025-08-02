package com.jee.clinichub.app.admin.sales_folder.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.sales_folder.model.SaleReportProj;
import com.jee.clinichub.app.admin.sales_folder.model.SalesReport;

@Repository
public interface SalesReportRepo extends JpaRepository<SalesReport, Long> {

    @Query("SELECT s FROM SalesReport s")
    Page<SaleReportProj> findAllSalesReport(Pageable pageable);

    // List<SalesReport> findAllByClinic_id(Long clinicId);
}
