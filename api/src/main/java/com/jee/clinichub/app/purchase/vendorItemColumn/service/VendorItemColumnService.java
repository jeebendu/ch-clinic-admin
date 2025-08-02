package com.jee.clinichub.app.purchase.vendorItemColumn.service;

import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumnDto;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemProj;
import com.jee.clinichub.global.model.Status;
import jakarta.validation.Valid;

public interface VendorItemColumnService {


    VendorItemColumnDto getById(Long id);

    Status saveOrUpdate(@Valid  VendorItemColumnDto vendorItemColumns);

   Status deleteByVendorId(Long id);

    VendorItemProj getByVendorId(Long id);

}
