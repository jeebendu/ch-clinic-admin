package com.jee.clinichub.app.expense.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;




/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "expense_items")
@EntityListeners(AuditingEntityListener.class)
public class ExpenseItem extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	

	@ManyToOne
    @JoinColumn(name = "expense_id")
    @JsonBackReference
    private Expense expense;
	 
	@Column(name="description")
	private String description;
	
	@Column(name="price")
	private double price;

	
	@Column(name="qty")
	private Integer qty;
	
	
	@Column(name="total")
	private double total;
	


	public ExpenseItem(ExpenseItemDto expenseItemDto) {
		super();
		if(expenseItemDto.getId()!=null){
			this.id = expenseItemDto.getId();
		}
		this.price = expenseItemDto.getPrice();
		this.qty = expenseItemDto.getQty();
		this.total = expenseItemDto.getTotal();
		this.description = expenseItemDto.getDescription();
	}



	public ExpenseItem(Long expenseId) {
		this.id = expenseId;
	}

	
}