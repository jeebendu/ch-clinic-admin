package com.jee.clinichub.app.expense.model;


import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.staff.model.StaffProj;

public interface ExpenseProj  {
	
    Long getId();
    String getUid();
    //CommonProj getBranch();
    CommonProj getPaymentType();
    double getSubtotal();
    double getDiscount();
    double getGrandTotal();
    String getRemark();
    boolean isApproved();
    StaffProj getApprovedBy();
	Date getApprovedTime();
	Date getCreatedTime();
	String getCreatedBy();
	Date getExpenseTime();
	List<ExpenseItemPro> getItems();


    default String getDescription() {
        List<ExpenseItemPro> items = getItems();
        return items.stream()
                    .map(ExpenseItemPro::getDescription) 
                    .collect(Collectors.joining(", "));
    }
	
}