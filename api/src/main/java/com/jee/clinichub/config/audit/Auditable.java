package com.jee.clinichub.config.audit;

import java.util.Date;

import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.global.utility.DateUtility;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Audited
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable<U> {

	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_time", nullable = false)
    private Date createdTime;

	@LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_time", nullable = false)
    private Date modifiedTime;
    
    @CreatedBy
    @Column(name = "created_by")
    private U createdBy;

 
    @LastModifiedBy
    @Column(name = "modified_by")
    private U modifiedBy;

    


}
