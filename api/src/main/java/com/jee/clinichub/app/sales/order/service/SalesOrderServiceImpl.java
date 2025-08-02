package com.jee.clinichub.app.sales.order.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.catalog.batch.model.Batch;
import com.jee.clinichub.app.catalog.batch.repository.BatchRepository;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductSerial;
import com.jee.clinichub.app.catalog.product.service.ProductService;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.app.customer.repository.CustomerRepository;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.service.PaymentTransactionService;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.app.sales.order.model.SalesOrder;
import com.jee.clinichub.app.sales.order.model.SalesOrderDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderItem;
import com.jee.clinichub.app.sales.order.model.SalesOrderItemDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderItemSerial;
import com.jee.clinichub.app.sales.order.model.SalesOrderItemSerialDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderProj;
import com.jee.clinichub.app.sales.order.model.Search;
import com.jee.clinichub.app.sales.order.repository.SalesOrderItemSerialRepository;
import com.jee.clinichub.app.sales.order.repository.SalesOrderRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.TypeConverter;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "salesService")
public class SalesOrderServiceImpl implements SalesOrderService {
	

    @Autowired
    private SalesOrderRepository salesOrderRepository;
    
    @Autowired
    SalesOrderItemSerialRepository salesOrderItemSerialRepository;
    
    @Autowired
    private PaymentTypeRepository paymentTypeRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    @Autowired
    ModuleRepository moduleRepository;
    
    @Autowired
    private BatchRepository batchRepository;
    
    
    @Autowired
    PaymentTransactionService paymentTransactionService;
    
    @Autowired
    private SequenceService sequenceService;
    
    @Autowired
    ProductService  productService;
    
    @Autowired TypeConverter typeConverter;
    
    @Autowired TemplateEngine htmlTemplateEngine;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Transactional
	@Override
	public Status saveOrUpdate(SalesOrderDto salesOrderDto) {
		try{
			
			Module module = moduleRepository.findByName(ModuleEnum.sales.toString());
			if(module==null){
				return new Status(false,"1005 : Contact Admin for Sequense");
			}
			
			/*boolean isExistName = (salesOrderDto.getId()==null) ? salesOrderRepository.existsByName(salesOrderDto.getName()): salesOrderRepository.existsByNameAndIdNot(salesOrderDto.getName(),salesOrderDto.getId());
			boolean isExistCode = (salesOrderDto.getId()==null) ? salesOrderRepository.existsByCode(salesOrderDto.getCode()): salesOrderRepository.existsByCodeAndIdNot(salesOrderDto.getCode(),salesOrderDto.getId());
			
			if(isExistName){return new Status(false,"SalesOrder Name already exist");
	    	}else if(isExistCode){return new Status(false,"SalesOrder Code already exist");}*/
			
			
			
			SalesOrder salesOrder = new SalesOrder();
			Branch branch = BranchContextHolder.getCurrentBranch();
			String nextSequense = null;
			
			
			
			if(salesOrderDto.getId()==null) {
				salesOrder = new SalesOrder(salesOrderDto);
				salesOrder.setBranch(branch);
				if(customerRepository.existsByPhone(salesOrderDto.getCustomer().getPhone())) {
					Customer customer = customerRepository.findCustomerByPhone(salesOrderDto.getCustomer().getPhone());
					//customer.setSalesOrder(salesOrder);
					salesOrder.setCustomer(customer);
				}
				nextSequense = sequenceService.getNextSequense(branch.getId(),module.getId());
				salesOrder.setUid(nextSequense);
			}else{
				salesOrder = this.setSalesOrder(salesOrderDto);
			}
			
			List<SalesOrderItem> salesOrderItem = salesOrder.getItems();
			
			salesOrder = salesOrderRepository.save(salesOrder); //update order status
			paymentTransactionService.saveOrUpdate(salesOrderToTransaction(salesOrder)); //update payment status
			
			//update product inventory qty
			salesOrderDto.getItems().forEach(item->{
				
				var existingItemOpt=salesOrderItem.stream().filter(a->a.getId().equals(item.getId())).findFirst();
				
				
				item.getSerials().forEach(batch->{
					var batchId = batch.getSerialId();
					Optional<Batch> existingBatch = batchRepository.findById(batchId);
					if(existingBatch.isPresent()) {
						Batch batchNew = new Batch();
						batchNew = existingBatch.get();
						batchNew.setQuantity(batchNew.getQuantity()-existingItemOpt.get().getQty());
					}
				});
				
				
				
				
			});
			
			
			if(salesOrderDto.getId()==null) {
				boolean status = sequenceService.incrementSequense(branch.getId(),module.getId(),nextSequense);
			}
			
			return new Status(true,( (salesOrderDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
  
	private Product itemToProduct(SalesOrderItemDto item) {
		Product product = new Product();
		product.setId(item.getProductId());
		product.setName(item.getProductName());
		product.setPrice(item.getPrice());
		product.setQty(item.getQty());
		product.setSerials(serialDtoToProSerial(item.getSerials()));
		return product;
	}


	private List<ProductSerial> serialDtoToProSerial(List<SalesOrderItemSerialDto> serialsDto) {
		List<ProductSerial> productSerials = new ArrayList<ProductSerial>();
		serialsDto.forEach(serialDto->{
			
			ProductSerial productSerial = new ProductSerial();
			productSerial.setId(serialDto.getSerialId());
			productSerial.setSerialNo(serialDto.getSerialNo());
			productSerial.setQty(serialDto.getQty());
			productSerials.add(productSerial);
		});
		return productSerials;
	}


	private SalesOrder setSalesOrder(SalesOrderDto salesOrderDto) {
		
    	SalesOrder exSalesOrder = salesOrderRepository.findById(salesOrderDto.getId()).get();
    	exSalesOrder.setRemark(salesOrderDto.getRemark());
    	exSalesOrder.setPaymentType(paymentTypeRepository.getById(salesOrderDto.getPaymentType().getId()));
    	exSalesOrder.setBranch(branchRepository.getById(salesOrderDto.getBranch().getId()));
    	exSalesOrder.setSubtotal(salesOrderDto.getSubtotal());
    	exSalesOrder.setDiscount(salesOrderDto.getDiscount());
    	exSalesOrder.setGrandTotal(salesOrderDto.getGrandTotal());
    	exSalesOrder.setDiscountType(salesOrderDto.getDiscountType());
    	exSalesOrder.setDiscountValue(salesOrderDto.getDiscountValue());
    	exSalesOrder.setPaidAmount(salesOrderDto.getPaidAmount());
    	exSalesOrder.setBalance(salesOrderDto.getBalance());
    	
    	List<SalesOrderItem> items = new ArrayList<SalesOrderItem>();
    	salesOrderDto.getItems().forEach(item->{
    		SalesOrderItem orderItem = new SalesOrderItem(item);
    		var newQty=	orderItem.getQty();
    		var existingItemOpt=exSalesOrder.getItems().stream().filter(a->a.getId().equals(orderItem.getId())).findFirst();
    		
    		if(existingItemOpt.isPresent()) {
        		orderItem.setQty(newQty-existingItemOpt.get().getQty());
        	}
    		
			orderItem.setSalesOrder(exSalesOrder);
			items.add(orderItem);
		});
    	exSalesOrder.setItems(items);
    	
		return exSalesOrder;
		
	}

	//@Override
  	public List<SalesOrderProj> getAllSalesOrdersx() {
    	List<SalesOrderProj> salesOrderList = salesOrderRepository.findAllProjectedBy();
    	//List<SalesOrderDto> salesOrderDtoList = salesOrderList.stream().map(SalesOrderDto::new).collect(Collectors.toList());
  		return salesOrderList;
  	}
	
	@Override
	public List<SalesOrderProj> getAllSalesOrders() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<SalesOrderProj> salesOrderList = salesOrderRepository.findAllProjectedByBranch_IdOrderByIdDesc(branch.getId());
  		return salesOrderList;
	}


    
	@Override
	@Cacheable(value = "SalesOrderCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public SalesOrderDto getById(Long id) {
		SalesOrderDto salesOrderDto = new SalesOrderDto();
		try{
			Optional<SalesOrder> salesOrder = salesOrderRepository.findById(id);
			if(salesOrder.isPresent()){
				salesOrderDto = new SalesOrderDto(salesOrder.get());
				
				List<SalesOrderItemDto> items = new ArrayList<SalesOrderItemDto>();
				salesOrderDto.getItems().forEach(item->{
					List<SalesOrderItemSerial> serials = salesOrderItemSerialRepository.findAllByItemId(item.getId());
					List<SalesOrderItemSerialDto> serialsDtoList = serials.stream().map(SalesOrderItemSerialDto::new).collect(Collectors.toList());
					item.setSerials(serialsDtoList);
					items.add(item);
				});
				salesOrderDto.setItems(items);
				
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return salesOrderDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<SalesOrder> salesOrder = salesOrderRepository.findById(id);
			if(!salesOrder.isPresent()){
				return new Status(false,"SalesOrder Not Found");
			}
			
			salesOrderRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	
	@Override
	public Status approveById(Long id) {
		try{
			Optional<SalesOrder> salesOrderOpt = salesOrderRepository.findById(id);
			if(!salesOrderOpt.isPresent()){
				return new Status(false,"SalesOrder Not Found");
			}
			
			 Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		     String approver = authentication.getName();
		     
			SalesOrder salesOrder = salesOrderOpt.get();
			salesOrder.setApproved(true);
			salesOrder.setApprovedBy(approver);
			salesOrder.setApprovedTime(new Date());
			salesOrderRepository.save(salesOrder);
			
			paymentTransactionService.saveOrUpdate(salesOrderToTransaction(salesOrder));
			
			return new Status(true,"Approved Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	
	  private PaymentTransactionDto salesOrderToTransaction(SalesOrder salesOrder) {
	    	
	    	PaymentTransactionDto paymentTransactionDto = new PaymentTransactionDto();
	    	paymentTransactionDto.setBranch(new BranchDto(salesOrder.getBranch()));
	    	paymentTransactionDto.setDeposit(salesOrder.getGrandTotal());
	    	paymentTransactionDto.setPaymentType(new PaymentTypeDto(salesOrder.getPaymentType()));
	    	paymentTransactionDto.setRemark("Sales Order - "+salesOrder.getUid());
	    	
			return paymentTransactionDto;
		}


	@Override
	public byte[] printById(Long id) {
		// HTML file to PDF
    	try {
    		SalesOrderDto salesOrderDto = getById(id);
    		String html = generateSalesInvoiceHtml(salesOrderDto);
    		
    		ConverterProperties converterProperties = new ConverterProperties();
    		converterProperties.setBaseUri(getBaseUri());
			HtmlConverter.convertToPdf(html,new FileOutputStream("temp/sales-invoice.pdf"),converterProperties);
			
			byte[] pdfBytes = typeConverter.fileToByteArray(new File("temp/sales-invoice.pdf"));
			return pdfBytes;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        log.info( "PDF Created! Success fully" );
		return null;
	}

	private String getBaseUri() {
		String filepath = "";
		try {
			File file = ResourceUtils.getFile("classpath:" + "templates/sales");
	        Path path = file.toPath();
	        filepath = path.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return filepath;
	}

	private String generateSalesInvoiceHtml(SalesOrderDto salesOrderDto) {
		
		final Context ctx = new Context(LocaleContextHolder.getLocale());
	    ctx.setVariable("email", "jee@gmail.com");
	    ctx.setVariable("name", "Jeebendu");
	    ctx.setVariable("springLogo", "images/spring.png");
	    ctx.setVariable("url", "jee.com");
	    ctx.setVariable("clinicName", "AAROAH CLINIC");
	    ctx.setVariable("clinicForm", "Sales Invoice");
	    ctx.setVariable("clinicLogo", "https://api.clinichub.in/v1/files/download?fileName=public/pati-logo.jpg");
	    
	    ctx.setVariable("data", salesOrderDto);
	    
	    final String htmlContent = this.htmlTemplateEngine.process("sales/invoice.html", ctx);
	    return htmlContent;
	}
	

    @Override
	public 	Page<SalesOrderProj> search(Search search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		return salesOrderRepository.search(
			pr,
			branch.getId(),
			search.getCustomerName() != null ? search.getCustomerName() : "",
			// search.getFromDate(),
			// search.getToDate(),
			search.getPaymentType()
		);
	}
	

	

	
}
