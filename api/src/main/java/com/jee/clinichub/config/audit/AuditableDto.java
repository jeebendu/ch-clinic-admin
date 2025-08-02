package com.jee.clinichub.config.audit;

import java.util.Date;

import com.jee.clinichub.global.utility.DateUtility;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class AuditableDto<U> {
    private String createdTime;
    private String modifiedTime;
    private U createdBy;
    private U modifiedBy;
    
    public AuditableDto(Date createdTime, U createdBy) {
        this.createdTime = DateUtility.dateToString(createdTime);
        this.createdBy = createdBy;
    }

    public AuditableDto(Date createdTime, U createdBy,Date modifiedTime, U modifiedBy) {
        this.createdTime = DateUtility.dateToString(createdTime);
        this.createdBy = createdBy;
        this.modifiedTime = DateUtility.dateToString(modifiedTime);
        this.modifiedBy = modifiedBy;
    }

}


