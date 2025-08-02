package com.jee.clinichub.app.expense.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.staff.model.Staff;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchExpense {

	private Long branch;

	private Long paymentType;

	private Long approved;
	
	private Long approvedBy;

	private String submitedBy;

}

