package com.jee.clinichub.global.tenant.model;

import lombok.Data;

@Data
public class TenantFilter {

    boolean active;
    String searchKey;
    
}
