package com.jee.clinichub.app.payment.transaction.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransaction;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionSearch;
import com.jee.clinichub.app.payment.transaction.repository.PaymentTransactionRepository;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.global.model.Status;

@Service(value = "paymentTransactionService")
public class PaymentTransactionServiceImpl implements PaymentTransactionService {
	
	private static final Logger log = LoggerFactory.getLogger(PaymentTransactionServiceImpl.class);

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    @Autowired
    private PaymentTypeRepository paymentTypeRepository;
    
	@Override
	@CacheEvict(value="paymentTransactionCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public Status saveOrUpdate(PaymentTransactionDto paymentTransactionDto) {
		try{
			
			PaymentTransaction paymentTransaction = new PaymentTransaction();
			
			if(paymentTransactionDto.getId()==null) {
				paymentTransaction = new PaymentTransaction(paymentTransactionDto);
				
			}else{
				paymentTransaction = this.setPaymentTransaction(paymentTransactionDto);
			}
			
			PaymentTransaction lastTransaction = paymentTransactionRepository.findTopByBranch_idOrderByIdDesc(paymentTransactionDto.getBranch().getId());
			double lastAmount = 0.00;
			if(lastTransaction!=null){
				lastAmount = lastTransaction.getTotal();
			}
			
			
			if(paymentTransactionDto.getDeposit()!=0.00){
				paymentTransaction.setTotal(lastAmount+paymentTransactionDto.getDeposit());
			}else if(paymentTransactionDto.getWithdraw()!=0.00){
				paymentTransaction.setTotal(lastAmount-paymentTransactionDto.getWithdraw());
			}
			
			paymentTransaction.setBranch(branchRepository.findById(paymentTransactionDto.getBranch().getId()).get());
			paymentTransaction.setPaymentType(paymentTypeRepository.findById(paymentTransactionDto.getPaymentType().getId()).get());
			
			paymentTransaction = paymentTransactionRepository.save(paymentTransaction);
			return new Status(true,( (paymentTransactionDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private PaymentTransaction setPaymentTransaction(PaymentTransactionDto paymentTransactionDto) {
    	PaymentTransaction exPaymentTransaction = paymentTransactionRepository.findById(paymentTransactionDto.getId()).get();
    	exPaymentTransaction.setWithdraw(paymentTransactionDto.getWithdraw());
    	exPaymentTransaction.setDeposit(paymentTransactionDto.getDeposit());
    	exPaymentTransaction.setTotal(paymentTransactionDto.getTotal());
		return exPaymentTransaction;
		
	}

	@Override
	public Page<PaymentTransactionDto> filter(PaymentTransactionSearch search, int pageNumber, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNumber, pageSize);
		return paymentTransactionRepository.search(pr,
				branch.getId(),
				search.getPaymentType()!= null ? search.getPaymentType() : null
				);
	
  	}


    
	@Override
	public PaymentTransactionDto getById(Long id) {
		PaymentTransactionDto paymentTransactionDto = new PaymentTransactionDto();
		try{
			Optional<PaymentTransaction> paymentTransaction = paymentTransactionRepository.findById(id);
			if(paymentTransaction.isPresent()){
				paymentTransactionDto = new PaymentTransactionDto(paymentTransaction.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return paymentTransactionDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<PaymentTransaction> paymentTransaction = paymentTransactionRepository.findById(id);
			if(!paymentTransaction.isPresent()){
				return new Status(false,"PaymentTransaction Not Found");
			}
			
			paymentTransactionRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	
	// @Override
	// public 	Page<PaymentTransactionDto> search(PaymentTransactionSearch search, int pageNo, int pageSize) {
	// 	Branch branch = BranchContextHolder.getCurrentBranch();
	// 	Pageable pr = PageRequest.of(pageNo, pageSize);
	// 	return paymentTransactionRepository.search(pr,branch.getId(),search.getInputValue());
	// }
	

	
}
