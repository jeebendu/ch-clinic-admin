package com.jee.clinichub.app.payment.type.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "paymentTypeService")
public class PaymentTypeServiceImpl implements PaymentTypeService {
	
	private static final Logger log = LoggerFactory.getLogger(PaymentTypeServiceImpl.class);

    @Autowired
    private PaymentTypeRepository paymentTypeRepository;
    
	@Override
	public Status saveOrUpdate(PaymentTypeDto paymentTypeDto) {
		try{
			
			boolean isExistName = (paymentTypeDto.getId()==null) ? paymentTypeRepository.existsByName(paymentTypeDto.getName()): paymentTypeRepository.existsByNameAndIdNot(paymentTypeDto.getName(),paymentTypeDto.getId());
			
			if(isExistName){return new Status(false,"PaymentType Name already exist");
	    	}
			
			PaymentType paymentType = new PaymentType();
			
			if(paymentTypeDto.getId()==null) {
				paymentType = new PaymentType(paymentTypeDto);
			}else{
				paymentType = this.setPaymentType(paymentTypeDto);
			}
			
			paymentType = paymentTypeRepository.save(paymentType);
			return new Status(true,( (paymentTypeDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private PaymentType setPaymentType(PaymentTypeDto paymentTypeDto) {
    	PaymentType exPaymentType = paymentTypeRepository.findById(paymentTypeDto.getId()).get();
    	exPaymentType.setName(paymentTypeDto.getName());
		return exPaymentType;
		
	}

	@Override
  	public List<PaymentTypeDto> getAllPaymentTypes() {
    	List<PaymentType> paymentTypeList = paymentTypeRepository.findAll();
    	List<PaymentTypeDto> paymentTypeDtoList = paymentTypeList.stream().map(PaymentTypeDto::new).collect(Collectors.toList());
  		return paymentTypeDtoList;
  	}

    @Override
    public PaymentType findByName(String name) {
        PaymentType paymentType = paymentTypeRepository.findPaymentTypeByName(name);
        return paymentType;
    }
    
    
	@Override
	public PaymentTypeDto getById(Long id) {
		PaymentTypeDto paymentTypeDto = new PaymentTypeDto();
		try{
			Optional<PaymentType> paymentType = paymentTypeRepository.findById(id);
			if(paymentType.isPresent()){
				paymentTypeDto = new PaymentTypeDto(paymentType.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return paymentTypeDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<PaymentType> paymentType = paymentTypeRepository.findById(id);
			if(!paymentType.isPresent()){
				return new Status(false,"PaymentType Not Found");
			}
			
			paymentTypeRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}
