package com.jee.clinichub.app.expense.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.expense.model.ExpenseDto;
import com.jee.clinichub.app.expense.model.ExpenseProj;
import com.jee.clinichub.app.expense.model.SearchExpense;
import com.jee.clinichub.global.model.Status;

public interface ExpenseService {
	
    ExpenseDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(ExpenseDto Expense);

	List<ExpenseProj> getAllExpenses();

	Status approveById(Long id);

    Status importData(MultipartFile file);

    Page<ExpenseProj> handleFilter(SearchExpense search,int pageno, int size);

}
