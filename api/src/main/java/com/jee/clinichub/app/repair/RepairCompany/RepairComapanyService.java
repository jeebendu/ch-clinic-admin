package com.jee.clinichub.app.repair.RepairCompany;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.global.model.Status;

public interface RepairComapanyService {
    
    List<RepairCompany> getAll();

    RepairCompany getById(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate( RepairCompanyDto repair);


}
