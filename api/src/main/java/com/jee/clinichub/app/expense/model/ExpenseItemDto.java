package com.jee.clinichub.app.expense.model;



import java.util.Date;

import jakarta.persistence.Column;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExpenseItemDto {
    
    private Long id;
	private double price;
	private Integer qty;
	private double total;
	private String description;
    
	
	
	public ExpenseItemDto(ExpenseItem expenseItem) {
		this.id = expenseItem.getId();
		this.price = expenseItem.getPrice();
		this.qty = expenseItem.getQty();
		this.total=expenseItem.getTotal();
		this.description=expenseItem.getDescription();
	}
	

    
    
}