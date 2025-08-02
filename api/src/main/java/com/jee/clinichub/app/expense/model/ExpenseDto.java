package com.jee.clinichub.app.expense.model;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.staff.model.StaffDto;

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
public class ExpenseDto {
    
    private Long id;
    
    private String uid;
     
    private BranchDto branch;
	 
    
	private PaymentTypeDto paymentType;
	
	private double subtotal;
	
	private double discount;
	
	private double grandTotal;

	private String remark;
	
	private Date expenseTime;
	
	private boolean approved;

	private StaffDto approvedBy;

	private Date approvedTime;
	
	List<ExpenseItemDto> items = new ArrayList<ExpenseItemDto>();
    
	
	
	public ExpenseDto(Expense expense) {
		this.id = expense.getId();
		this.uid = expense.getUid();
		this.branch = new BranchDto(expense.getBranch());
		this.paymentType = new PaymentTypeDto(expense.getPaymentType());
		this.subtotal = expense.getSubtotal();
		this.discount = expense.getDiscount();
		this.grandTotal = expense.getGrandTotal();
		this.remark = expense.getRemark();
		this.approved = expense.isApproved();
		if(expense.getApprovedBy()!=null){
			this.approvedBy = new StaffDto(expense.getApprovedBy());
		}
		this.approvedTime = expense.getApprovedTime();
		this.expenseTime = expense.getExpenseTime();
		
		expense.getItems().forEach(item->{
			this.items.add(new ExpenseItemDto(item));
		});
		
	}
	

    
    
}