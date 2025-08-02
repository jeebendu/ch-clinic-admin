package com.jee.clinichub.app.expense.model;

public interface ExpenseItemPro  {
	
    Long getId();
    Double getPrice();
    Integer getQty();
    Double getTotal();
    String getDescription();
	
}