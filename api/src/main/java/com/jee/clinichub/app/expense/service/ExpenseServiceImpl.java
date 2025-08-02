package com.jee.clinichub.app.expense.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.expense.model.Expense;
import com.jee.clinichub.app.expense.model.ExpenseDto;
import com.jee.clinichub.app.expense.model.ExpenseItem;
import com.jee.clinichub.app.expense.model.ExpenseItemDto;
import com.jee.clinichub.app.expense.model.ExpenseProj;
import com.jee.clinichub.app.expense.model.SearchExpense;
import com.jee.clinichub.app.expense.repository.ExpenseRepository;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.service.PaymentTransactionService;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.global.model.Status;

@Service(value = "expenseService")
public class ExpenseServiceImpl implements ExpenseService {

	private static final Logger log = LoggerFactory.getLogger(ExpenseServiceImpl.class);

	@Autowired
	private ExpenseRepository expenseRepository;

	@Autowired
	private PaymentTypeRepository paymentTypeRepository;

	@Autowired
	private BranchRepository branchRepository;

	@Autowired
	ModuleRepository moduleRepository;

	@Autowired
	StaffRepository staffRepository;

	@Autowired
	PaymentTransactionService paymentTransactionService;

	@Autowired
	private SequenceService sequenceService;

	@Override
	public Status saveOrUpdate(ExpenseDto expenseDto) {
		try {

			Module module = moduleRepository.findByName(ModuleEnum.expense.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			if (expenseDto.getPaymentType().getId() == null) {
				return new Status(false, "1006 : Please choose pay method");
			}

			Expense expense = new Expense();
			Branch branch = BranchContextHolder.getCurrentBranch();
			String nextSequense = null;
			if (expenseDto.getId() == null) {

				expense = new Expense(expenseDto);
				expense.setBranch(branch);

				nextSequense = sequenceService.getNextSequense(branch.getId(), module.getId());
				expense.setUid(nextSequense);
			} else {
				expense = this.setExpense(expenseDto);
			}

			expense = expenseRepository.save(expense);

			if (expenseDto.getId() == null) {
				boolean status = sequenceService.incrementSequense(branch.getId(), module.getId(), nextSequense);
			}

			return new Status(true, ((expenseDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Expense setExpense(ExpenseDto expenseDto) {
		Expense exExpense = expenseRepository.findById(expenseDto.getId())
				.orElseThrow(() -> new EntityNotFoundException("Expense not found with id: " + expenseDto.getId()));

		exExpense.setRemark(expenseDto.getRemark());
		exExpense.setPaymentType(paymentTypeRepository.findById(expenseDto.getPaymentType().getId())
				.orElseThrow(() -> new EntityNotFoundException(
						"PaymentType not found with id: " + expenseDto.getPaymentType().getId())));
		exExpense.setBranch(branchRepository.findById(expenseDto.getBranch().getId())
				.orElseThrow(() -> new EntityNotFoundException(
						"Branch not found with id: " + expenseDto.getBranch().getId())));
		exExpense.setSubtotal(expenseDto.getSubtotal());
		exExpense.setDiscount(expenseDto.getDiscount());
		exExpense.setGrandTotal(expenseDto.getGrandTotal());

		List<ExpenseItem> existingItems = exExpense.getItems();
		List<Long> dtoItemIds = expenseDto.getItems().stream()
				.map(ExpenseItemDto::getId)
				.collect(Collectors.toList());

		// Remove items not present in the DTO
		existingItems.removeIf(existingItem -> !dtoItemIds.contains(existingItem.getId()));

		// Update or add items
		expenseDto.getItems().forEach(itemDto -> {
			ExpenseItem expenseItem = existingItems.stream()
					.filter(existingItem -> existingItem.getId().equals(itemDto.getId()))
					.findFirst()
					.map(existingItem -> updateExpenseItem(existingItem, itemDto))
					.orElseGet(() -> createExpenseItem(itemDto, exExpense));

			if (!existingItems.contains(expenseItem)) {
				existingItems.add(expenseItem);
			}
		});

		return exExpense;
	}

	private ExpenseItem updateExpenseItem(ExpenseItem existingItem, ExpenseItemDto itemDto) {
		existingItem.setDescription(itemDto.getDescription());
		existingItem.setPrice(itemDto.getPrice());
		existingItem.setQty(itemDto.getQty());
		existingItem.setTotal(itemDto.getTotal());
		return existingItem;
	}

	private ExpenseItem createExpenseItem(ExpenseItemDto itemDto, Expense exExpense) {
		ExpenseItem newItem = new ExpenseItem(itemDto);
		newItem.setExpense(exExpense);
		return newItem;
	}

	@Override
	public List<ExpenseProj> getAllExpenses() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<ExpenseProj> expenseList = expenseRepository.findAllProjectedByBranch_IdOrderByIdDesc(branch.getId());
		return expenseList;
	}

	@Override
	@Cacheable(value = "expenseCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public ExpenseDto getById(Long id) {
		return expenseRepository.findById(id).map(ExpenseDto::new).orElseThrow(()->{
			throw new EntityNotFoundException("Expense not found");
		});
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Expense> expense = expenseRepository.findById(id);
			if (!expense.isPresent()) {
				return new Status(false, "Expense Not Found");
			}

			expenseRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Status approveById(Long id) {
		try {
			Optional<Expense> expenseOpt = expenseRepository.findById(id);
			if (!expenseOpt.isPresent()) {
				return new Status(false, "Expense Not Found");
			}
   
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String approver = authentication.getName();
			Staff approverStaff = staffRepository.findByUser_Username(approver).get();

			Expense expense = expenseOpt.get();
			expense.setApproved(true);
			expense.setApprovedBy(approverStaff);
			expense.setApprovedTime(new Date());
			expenseRepository.save(expense);

			paymentTransactionService.saveOrUpdate(expenseToTransaction(expense));

			return new Status(true, "Approved Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private PaymentTransactionDto expenseToTransaction(Expense expense) {

		PaymentTransactionDto paymentTransactionDto = new PaymentTransactionDto();
		paymentTransactionDto.setBranch(new BranchDto(expense.getBranch()));
		paymentTransactionDto.setWithdraw(expense.getGrandTotal());
		paymentTransactionDto.setPaymentType(new PaymentTypeDto(expense.getPaymentType()));
		paymentTransactionDto.setRemark(expense.getRemark());

		return paymentTransactionDto;
	}

	@Override
	public Status importData(MultipartFile file) {
		try (
				InputStream inputStream = file.getInputStream();
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
				CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT)) {

			List<Expense> expensesList = new ArrayList<>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();

			Module module = moduleRepository.findByName(ModuleEnum.expense.toString());
			Expense expense;
			List<Branch> branchList = branchRepository.findAll();
			List<PaymentType> paymentTypeList = paymentTypeRepository.findAll();
			String nextSequense = null;

			int skipRows = 1;
			int n = 2;
			for (CSVRecord row : csvRecords) {
				if (skipRows > 0) {
					skipRows--;
					continue;
				}

				expense = new Expense();
				if (!row.get(0).equals("")) {

					String branchName = row.get(9);
					Optional<Branch> filteredBranch = branchList.stream()
							.filter(i -> branchName.equalsIgnoreCase(i.getCode())).findFirst();
					Branch branchObj = filteredBranch.orElse(null);

					nextSequense = sequenceService.getNextSequense(branchObj.getId(), module.getId());
					boolean status = sequenceService.incrementSequense(branchObj.getId(), module.getId(), nextSequense);
					String approvedBy = row.get(7);
					Staff approvedStaff = staffRepository.findByFirstnameIgnoreCase(approvedBy);

					String dateString = row.get(1);
					SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM");
					Date approvedTime = null;
					try {
						approvedTime = dateFormat.parse(dateString);

						Calendar calendar = Calendar.getInstance();
						int currentYear = calendar.get(Calendar.YEAR);

						calendar.setTime(approvedTime);
						calendar.set(Calendar.YEAR, currentYear);
						approvedTime = calendar.getTime();
					} catch (ParseException e) {
						e.printStackTrace();
					}
					boolean approved = true;
					String subTotalStr = row.get(5).substring(1).replace(",", "");
					Double subtotal = Double.parseDouble(subTotalStr);
					Double discount = Double.valueOf(0);
					Double grandTotal = subtotal - discount;
					PaymentType paymentType = paymentTypeList.get(0);

					int qty = Integer.parseInt(row.get(4));
					String priceStr = row.get(3).substring(1).replace(",", "");
					Double price = Double.parseDouble(priceStr);
					Double total = qty * price;

					List<ExpenseItem> items = new ArrayList<>();
					ExpenseItem item = new ExpenseItem();
					item.setPrice(price);
					item.setQty(qty);
					item.setTotal(total);
					item.setDescription(row.get(2));
					items.add(item);

					expense = Expense.builder()
							.approved(approved)
							.approvedBy(approvedStaff)
							.approvedTime(approvedTime)
							.branch(branchObj)
							.discount(discount)
							.expenseTime(new Date())
							.grandTotal(grandTotal)
							.subtotal(subtotal)
							.paymentType(paymentType)
							.items(items)
							.uid(nextSequense)
							.build();

					for (ExpenseItem expenseItem : items) {
						expenseItem.setExpense(expense);
					}

					expensesList.add(expense);

				}

				n++;
			}
			expenseRepository.saveAll(expensesList);
			log.info("Save process started");

			return new Status(true, "Enquiry Imported Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			return new Status(false, "Something went wrong");
		}
	}

	@Override
	public Page<ExpenseProj> handleFilter(SearchExpense search ,int page, int size) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(page, size);

		return expenseRepository.search(
				pr,
				branch.getId(),
				search.getPaymentType()!= null ? search.getPaymentType() : null,
				search.getApproved()!= null ? search.getApproved() : null,
				search.getApprovedBy()!= null ? search.getApprovedBy() : null
				// search.getSubmitedBy() != null ? search.getSubmitedBy() : null
				);

	}

	}