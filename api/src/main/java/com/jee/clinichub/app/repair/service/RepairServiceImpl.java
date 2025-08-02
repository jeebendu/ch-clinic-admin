package com.jee.clinichub.app.repair.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.courier.model.Courier;
import com.jee.clinichub.app.courier.repository.CourierRepository;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemDataDto;
import com.jee.clinichub.app.repair.RepairProblemData.service.RepairProblemService;
import com.jee.clinichub.app.repair.model.AddressType;
import com.jee.clinichub.app.repair.model.AddressTypeDto;
import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairAddress;
import com.jee.clinichub.app.repair.model.RepairCourier;
import com.jee.clinichub.app.repair.model.RepairCourierDto;
import com.jee.clinichub.app.repair.model.RepairDto;
import com.jee.clinichub.app.repair.model.RepairPayment;
import com.jee.clinichub.app.repair.model.RepairPaymentDto;
import com.jee.clinichub.app.repair.model.RepairSpeaker;
import com.jee.clinichub.app.repair.model.RepairStatus;
import com.jee.clinichub.app.repair.model.RepairStatusDto;
import com.jee.clinichub.app.repair.repairTestDelivery.Repository.RepairTestDeliveryRepository;
import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDelivery;
import com.jee.clinichub.app.repair.repository.AddressTypeRepository;
import com.jee.clinichub.app.repair.repository.RepairAddressRepo;
import com.jee.clinichub.app.repair.repository.RepairCourierRepository;
import com.jee.clinichub.app.repair.repository.RepairPaymentRepository;
import com.jee.clinichub.app.repair.repository.RepairRepository;
import com.jee.clinichub.app.repair.repository.RepairStatusRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "repairService")
public class RepairServiceImpl implements RepairService {


	public static final String BASEURI = "src/main/resources/templates/repair";

	@Autowired
	private RepairRepository repairRepository;

	@Autowired
	private SequenceService sequenceService;

	@Autowired
	ModuleRepository moduleRepository;

	@Autowired
	TemplateEngine htmlTemplateEngine;

	@Autowired
	TypeConverter typeConverter;

	@Autowired
	RepairStatusRepository repairStatusRepository;

	@Autowired
	RepairPaymentRepository repairPaymentRepository;

	@Autowired
	RepairCourierRepository repairCourierRepository;

	@Autowired AddressTypeRepository addressTypeRepository;

	@Autowired RepairAddressRepo repairAddressRepo;

	@Autowired  CourierRepository courierRepository;
	
	@Autowired PaymentTypeRepository paymentTypeRepository;

	@Autowired
	TenantService tenantService;

	@Autowired
	RepairProblemService repairProblemService;

	@Autowired RepairTestDeliveryRepository repairTestDeliveryRepository;

	 @Autowired FileService fileService;

	@Override
	public Status saveOrUpdate(RepairDto repairDto) {
		try {

			// boolean isExistName = (repairDto.getId()==null) ?
			// repairRepository.existsByName(repairDto.getName()):
			// repairRepository.existsByNameAndIdNot(repairDto.getName(),repairDto.getId());
			// boolean isExistCode = (repairDto.getId()==null) ?
			// repairRepository.existsByCode(repairDto.getCode()):
			// repairRepository.existsByCodeAndIdNot(repairDto.getCode(),repairDto.getId());

			// if(isExistName){return new Status(false,"Repair Name already exist");
			// }else if(isExistCode){return new Status(false,"Repair Code already exist");}

			Module module = moduleRepository.findByName(ModuleEnum.Repair.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}
			String nextSequense = null;

			repairDto.setBranch(new BranchDto(BranchContextHolder.getCurrentBranch()));

			Repair repair = new Repair();

			if (repairDto.getId() == null) {
				repair = new Repair(repairDto);
				nextSequense = sequenceService.getNextSequense(repairDto.getBranch().getId(), module.getId());
				repair.setOrderId(nextSequense);
				repair.setOrderDate(new Date());

			} else {
				repair = this.setRepair(repairDto);
			}

			repair = repairRepository.save(repair);
			return new Status(true, ((repairDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Repair setRepair(RepairDto repairDto) {
		ObjectMapper mapper = new ObjectMapper();
		Repair exRepair = repairRepository.findById(repairDto.getId()).get();

		RepairAddress repairBillingAddress =new RepairAddress(repairDto.getRepairBillingAddress()) ;
		RepairAddress repairShippingAddress = new RepairAddress(repairDto.getRepairShippingAddress());
		repairBillingAddress =repairAddressRepo.save(repairBillingAddress);
		repairShippingAddress =repairAddressRepo.save(repairShippingAddress);

  		//repair couriers
		 List<RepairCourier> repairCouriers = repairDto.getRepairCourierList().stream()
        .map(dto -> {
            RepairCourier repaircourier = new RepairCourier(dto);
            // Ensure the Courier entity is managed
            Courier managedCourier = courierRepository.findById(dto.getCourier().getId())
                .orElseThrow(() -> new EntityNotFoundException("Courier not found"));
            repaircourier.setCourier(managedCourier);
            repaircourier.setRepair(exRepair);
            return repaircourier;
        })
        .collect(Collectors.toList());
  		repairCouriers = repairCourierRepository.saveAll(repairCouriers);

		//repair payments
		  List<RepairPayment> repairPayments = repairDto.getRepairPaymentList().stream()
		  .map(dto -> {
			  RepairPayment repairPayment = new RepairPayment(dto);
	  
			  // Ensure the PaymentType entity is managed
			  PaymentType managedPaymentType = paymentTypeRepository.findById(dto.getPaymentType().getId())
				  .orElseThrow(() -> new EntityNotFoundException("PaymentType not found"));
			  repairPayment.setPaymentType(managedPaymentType);
	  
			  repairPayment.setRepair(exRepair);
			  return repairPayment;
		  })
		  .collect(Collectors.toList());
    repairPayments = repairPaymentRepository.saveAll(repairPayments);


		exRepair.setOrderId(repairDto.getOrderId());

		try {
			exRepair.setRepairProblem(mapper.writeValueAsString(repairDto.getRepairProblem()));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		// exRepair.setOrderDate(repairDto.getOrderDate());
		exRepair.setRushorder(repairDto.isRushorder());
		exRepair.setRepairBillingAddress(repairBillingAddress);
		exRepair.setRepairShippingAddress(repairShippingAddress);
		exRepair.setSubTotal(repairDto.getSubTotal());
		exRepair.setDiscount(repairDto.getDiscount());
		exRepair.setGrandTotal(repairDto.getGrandTotal());
		exRepair.setPendingBalance(repairDto.getPendingBalance());
		exRepair.setTotalPaid(repairDto.getTotalPaid());
		exRepair.setRepairSpeaker(new RepairSpeaker(repairDto.getRepairSpeakerDto()));

		return exRepair;

	}

	@Override
	public List<RepairDto> getAllRepairs() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<Repair> repairList = repairRepository.findAllByBranch_id(branch.getId());
		List<RepairDto> repairDtoList = repairList.stream().map(RepairDto::new).collect(Collectors.toList());
		return repairDtoList;
	}

	@Override
	public Repair findByName(String name) {
		Repair repair = null;// repairRepository.findRepairByName(name);
		return repair;
	}

	@Override
	// @Cacheable(value = "repairCache",keyGenerator =
	// "multiTenantCacheKeyGenerator")
	public RepairDto getById(Long id) {
		RepairDto repairDto = new RepairDto();

		try {
			Optional<Repair> repair = repairRepository.findById(id);
			if (repair.isPresent()) {
				repairDto = new RepairDto(repair.get());

				final RepairDto repairDtoFinal = repairDto;

				Set<Long> repairProblemIdSet = Arrays.stream(repairDtoFinal.getRepairProblem())
						.map(RepairProblemDataDto::getId)
						.collect(Collectors.toSet());

				List<RepairProblemDataDto> repairProblemDtoList = repairProblemService.getAllRepairProblemData()
						.stream()
						.peek(data -> data.setStatus(repairProblemIdSet.contains(data.getId())))
						.collect(Collectors.toList());

				repairDto.setRepairProblem(
						repairProblemDtoList.toArray(new RepairProblemDataDto[repairProblemDtoList.size()]));
				
			    List<RepairCourier> repairCouriers = repairCourierRepository.findAllByRepairId(id);
				 List<RepairCourierDto> repairCourierDtos = repairCouriers.stream()
		                .map(RepairCourierDto::new)
		                .collect(Collectors.toList());
				 // Set the list of RepairCourierDto in the RepairDto
		        repairDto.setRepairCourierList(repairCourierDtos);

				List<RepairPayment> repairPayments = repairPaymentRepository.findAllByRepair_id(id);
				// Convert the RepairPayment entities to RepairPaymentDto
				List<RepairPaymentDto> repairPaymentDtos = repairPayments.stream()
						.map(RepairPaymentDto::new)
						.collect(Collectors.toList());
				// Set the list of RepairPaymentDto in the RepairDto
				repairDto.setRepairPaymentList(repairPaymentDtos);
		   

			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return repairDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Repair> repair = repairRepository.findById(id);
			if (!repair.isPresent()) {
				return new Status(false, "Repair Not Found");
			}
			List<RepairCourier> repairCouriers = repairCourierRepository.findAllByRepair_id(id);
			if (!repairCouriers.isEmpty()) {
				repairCourierRepository.deleteAll(repairCouriers);
			}
			List<RepairPayment> repairPayments = repairPaymentRepository.findAllByRepair_id(id);
			if (!repairPayments.isEmpty()) {
				repairPaymentRepository.deleteAll(repairPayments);
			}

			Optional<RepairTestDelivery> repairTestDelivery = repairTestDeliveryRepository.findByRepair_id(id);
			if (repairTestDelivery.isPresent()) {
				repairTestDeliveryRepository.deleteById(repairTestDelivery.get().getId());
			}



			repairRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public List<Repair> getAllRepair() {
		List<Repair> repairList = repairRepository.findAll();
		return repairList;
	}

	@Override
	public byte[] printById(Long id) {
		// HTML file to PDF
		try {
			RepairDto repairDto = getById(id);
			
			Optional<Repair> repair = repairRepository.findById(id);
			if (repair.isPresent()) {
				repairDto = new RepairDto(repair.get());

				final RepairDto repairDtoFinal = repairDto;

				Set<Long> repairProblemIdSet = Arrays.stream(repairDtoFinal.getRepairProblem())
						.map(RepairProblemDataDto::getId)
						.collect(Collectors.toSet());
						log.info("repairProblemIdSet: "+repairProblemIdSet);

				List<RepairProblemDataDto> repairProblemDtoList = repairProblemService.getAllRepairProblemData()
						.stream()
						.filter(data -> repairProblemIdSet.contains(data.getId()))
						.collect(Collectors.toList());
						log.info("repairProblemDtoList: "+repairProblemDtoList);


				repairDto.setRepairProblem(
						repairProblemDtoList.toArray(new RepairProblemDataDto[repairProblemDtoList.size()]));

			}

			String html = generateRepairFormHtml(repairDto);

			File tempFile = File.createTempFile("repairForm", ".pdf");
			FileOutputStream fos = new FileOutputStream(tempFile);

			ConverterProperties converterProperties = new ConverterProperties();
			// converterProperties.setBaseUri(getBaseUri());
			HtmlConverter.convertToPdf(html, fos, converterProperties);

			byte[] pdfBytes = typeConverter.fileToByteArray(new File(tempFile.getPath()));
			return pdfBytes;
		} catch (FileNotFoundException e) {
			
			e.printStackTrace();
		} catch (IOException e) {
			
			e.printStackTrace();
		}
		log.info("PDF Created! Success fully");
		return null;
	}

	

	private String generateRepairFormHtml(RepairDto repairDto) {
				try{
					
			   
					final Context ctx = new Context(LocaleContextHolder.getLocale());
			
					String tenantId = TenantContextHolder.getCurrentTenant();
					Tenant tenant = tenantService.findByTenantId(tenantId);
					String tenantLogoUrl = fileService.getSecureUrl(tenant.getLogo(), true, tenantId);

					String host = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

					ctx.setVariable("clinicForm", "RepairForm Report");
		    		ctx.setVariable("clinicName", tenant.getTitle());
		    		ctx.setVariable("clinicLogo", tenantLogoUrl);
		    
		   			 ctx.setVariable("data", repairDto);
		    
		    		

					final String htmlContent = this.htmlTemplateEngine.process("repair/repairForm1.html", ctx);
					return htmlContent;
				}
				catch (Exception e) {
					
					e.printStackTrace();
				}
			return null;
		
	}

	@Override
	public byte[] printRepairPayment(Long repairId, Long payId) {
		// HTML file to PDF
		try {
			RepairDto repairDto = getById(repairId);

			if (payId != 0) {
				List<RepairPaymentDto> repairPaymentList = new ArrayList<RepairPaymentDto>();

				repairPaymentList = repairDto.getRepairPaymentList().stream().filter(data -> payId == data.getId())
						.collect(Collectors.toList());
				repairDto.setRepairPaymentList(repairPaymentList);
			}

			String html = generateRepairFormHtml(repairDto, "payment", payId);

			ConverterProperties converterProperties = new ConverterProperties();
			converterProperties.setBaseUri(getBaseUri());
			fileWithDirectoryAssurance("temp");
			HtmlConverter.convertToPdf(html, new FileOutputStream("temp/repair-payment.pdf"), converterProperties);

			byte[] pdfBytes = typeConverter.fileToByteArray(new File("temp/repair-payment.pdf"));
			return pdfBytes;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		log.info("PDF Created! Success fully");
		return null;
	}

	private String getBaseUri() {
		String filepath = "";
		try {
			File file = ResourceUtils.getFile("classpath:" + "templates/repair");
			Path path = file.toPath();
			filepath = path.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return filepath;
	}

	/** Creates parent directories if necessary. Then returns file */
	private static boolean fileWithDirectoryAssurance(String directory) {
		File dir = new File(directory);
		if (!dir.exists())
			dir.mkdirs();
		return true;
	}

	private String generateRepairFormHtml(RepairDto repairDto, String type, Long payId) {
		String tenantId = TenantContextHolder.getCurrentTenant();
		Tenant tenant = tenantService.findByTenantId(tenantId);
		String tenantLogoUrl = fileService.getSecureUrl(tenant.getLogo(), true, tenantId);

		String formName = "";
		String templateName = "";
		if (type == "ack") {
			formName = "Repair From";
			templateName = "repair/repairForm1.html";
		} else if (type == "payment") {
			formName = "Payment Receipt";
			templateName = "repair/payment/payment.html";
		}

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("clinicForm", "RepairPayment Report");
		ctx.setVariable("clinicName", tenant.getTitle());
		ctx.setVariable("clinicLogo", tenantLogoUrl);

			 ctx.setVariable("data", repairDto);
		final String htmlContent = this.htmlTemplateEngine.process(templateName, ctx);
		return htmlContent;
	}

	@Override
	public List<RepairStatusDto> getRepairStatus() {
		List<RepairStatus> statusList = repairStatusRepository.findAll();
		List<RepairStatusDto> statusDtoList = statusList.stream().map(RepairStatusDto::new)
				.collect(Collectors.toList());
		return statusDtoList;
	}

	@Override
	public List<RepairPaymentDto> getPaymentByRepairId(Long repairId) {
		List<RepairPayment> paymentList = repairPaymentRepository.findAllByRepair_id(repairId);
		List<RepairPaymentDto> paymentDtoList = paymentList.stream().map(RepairPaymentDto::new)
				.collect(Collectors.toList());
		return paymentDtoList;
	}

	@Override
	public List<RepairCourierDto> getCourierByRepairId(Long repairId) {
		List<RepairCourier> courierList = repairCourierRepository.findAllByRepair_id(repairId);
		List<RepairCourierDto> courierDtoList = courierList.stream().map(RepairCourierDto::new)
				.collect(Collectors.toList());
		return courierDtoList;
	}

	@Override
	public Status saveOrUpdateRepairPayment(@Valid RepairPaymentDto repairPaymentDTo) {
		try{
			RepairPayment repairPayment = new RepairPayment();

			if (repairPaymentDTo.getId() == null) {
				repairPayment = new RepairPayment(repairPaymentDTo);
				repairPayment.setPaymentType(new PaymentType(repairPaymentDTo.getPaymentType()));
				//repairPayment.setRepair(null);
				

			} else {
				repairPayment = this.setRepairPayment(repairPaymentDTo);
			}

			repairPayment = repairPaymentRepository.save(repairPayment);
			return new Status(true, ((repairPaymentDTo.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private RepairPayment setRepairPayment(@Valid RepairPaymentDto repairPaymentDTo) {
		RepairPayment exRepairPayment = new RepairPayment();
		try{
			 exRepairPayment = repairPaymentRepository.findById(repairPaymentDTo.getId()).get();
			exRepairPayment.setAmount(repairPaymentDTo.getAmount());
			exRepairPayment.setDate(repairPaymentDTo.getDate());
			exRepairPayment.setRepairStatus(new RepairStatus(repairPaymentDTo.getRepairStatus()));
			exRepairPayment.setPaymentType(new PaymentType(repairPaymentDTo.getPaymentType()));
			
		}
		catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		
		return exRepairPayment;
	}

	@Override
	public List<AddressTypeDto> getAddressType() {
		List<AddressType> addressTypeList = addressTypeRepository.findAll();
		List<AddressTypeDto> addressTypeDtoList = addressTypeList.stream().map(AddressTypeDto::new)
				.collect(Collectors.toList());
		return addressTypeDtoList;
	}

	@Override
	public Status deletePaymentById(Long id) {
		try {
			Optional<RepairPayment> repairPayment = repairPaymentRepository.findById(id);
			if (!repairPayment.isPresent()) {
				return new Status(false, "Repair Payment Not Found");
			}
			repairPaymentRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Status deleteCourierById(Long id) {
		try {
			Optional<RepairCourier> repairCourier = repairCourierRepository.findById(id);
			if (!repairCourier.isPresent()) {
				return new Status(false, "Repair Courier Not Found");
			}
			repairCourierRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}



	

}
