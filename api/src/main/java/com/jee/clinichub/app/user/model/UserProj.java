package com.jee.clinichub.app.user.model;

import java.sql.Timestamp;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.global.utility.DateUtility;

public interface UserProj {
    long getId();
	String getUsername();
    String getName();
    String getEmail();
    String getPhone();
    CommonProj getBranch();
    CommonProj getRole();
    Timestamp getEffectiveTo();
    String getImage();
    Timestamp getEffectiveFrom();

    default String getStatus() {
        Timestamp effectiveTo = getEffectiveTo();
        Timestamp effectiveFrom = getEffectiveFrom();
        Timestamp today = new Timestamp(System.currentTimeMillis());
        effectiveTo = DateUtility.setEndOfDay(effectiveTo);
        return DateUtility.isActive(effectiveFrom, effectiveTo, today) ? "active" : "inactive";
    }
}