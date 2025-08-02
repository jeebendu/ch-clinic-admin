package com.jee.clinichub.app.purchase.order.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.amazonaws.services.s3.model.ExistingObjectReplication;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.branch.service.BranchServiceImpl;
import com.jee.clinichub.app.catalog.batch.model.Batch;
import com.jee.clinichub.app.catalog.batch.repository.BatchRepository;
import com.jee.clinichub.app.catalog.brand.repository.BrandRepository;
import com.jee.clinichub.app.catalog.brand.service.BrandServiceImpl;
import com.jee.clinichub.app.catalog.category.repository.CategoryRepository;
import com.jee.clinichub.app.catalog.category.service.CategoryServiceImpl;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.app.catalog.product.repository.ProductRepository;
import com.jee.clinichub.app.catalog.product.service.ProductService;
import com.jee.clinichub.app.catalog.product.service.ProductServiceImpl;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.service.PaymentTransactionService;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.payment.type.repository.PaymentTypeRepository;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrder;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderItem;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderItem.ExpiryDate;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderItemDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderProj;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderScan;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderScanItem;
import com.jee.clinichub.app.purchase.order.model.Search;
import com.jee.clinichub.app.purchase.order.repository.PurchaseOrderRepository;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumn;
import com.jee.clinichub.app.purchase.vendorItemColumn.repository.VendorItemColumnRepo;
import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.app.vendor.model.VendorDto;
import com.jee.clinichub.app.vendor.repository.VendorRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.persistence.EntityNotFoundException;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.Block;
import software.amazon.awssdk.services.textract.model.BlockType;
import software.amazon.awssdk.services.textract.model.DetectDocumentTextRequest;
import software.amazon.awssdk.services.textract.model.DetectDocumentTextResponse;
import software.amazon.awssdk.services.textract.model.Document;

@Service(value = "purchaseService")
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

	private static final Logger log = LoggerFactory.getLogger(PurchaseOrderServiceImpl.class);

	private final TextractClient textractClient;
	@Autowired
	VendorRepository vendorRepository;

	@Autowired
	CategoryRepository categoryRepository;

	@Autowired
	BranchServiceImpl branchServiceImpl;

	@Autowired
	CategoryServiceImpl categoryServiceImpl;
	@Autowired
	BrandServiceImpl brandServiceImpl;

	@Autowired
	BrandRepository brandRepository;

	@Autowired
	ProductServiceImpl productService;

	@Autowired
	public PurchaseOrderServiceImpl(TextractClient textractClient) {
		this.textractClient = textractClient;
	}

	@Autowired
	private PurchaseOrderRepository purchaseOrderRepository;

	@Autowired
	private PaymentTypeRepository paymentTypeRepository;
	@Autowired
	TypeConverter typeConverter;

	@Autowired
	TemplateEngine htmlTemplateEngine;

	@Autowired
	private VendorItemColumnRepo vItemColumnRepo;

	@Autowired
	private BranchRepository branchRepository;

	@Autowired
	PaymentTransactionService paymentTransactionService;

	@Autowired
	ModuleRepository moduleRepository;

	@Autowired
	private SequenceService sequenceService;

	@Autowired
	private ProductRepository productRepository;

	

	@Autowired
	private BatchRepository batchRepository;

	// @Transactional("tenantTransactionManager")
	@Override
	public Status saveOrUpdate(PurchaseOrderDto purchaseOrderDto) {
		try {

			Module module = moduleRepository.findByName(ModuleEnum.purchase.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			PurchaseOrder purchaseOrder = new PurchaseOrder();
			Branch branch = BranchContextHolder.getCurrentBranch();
			String nextSequense = null;

			if (purchaseOrderDto.getId() == null) {
				purchaseOrder = new PurchaseOrder(purchaseOrderDto);
				purchaseOrder.setBranch(branch);
				nextSequense = sequenceService.getNextSequense(branch.getId(), module.getId());
				purchaseOrder.setUid(nextSequense);
			} else {
				purchaseOrder = this.setPurchaseOrder(purchaseOrderDto);
			}

			purchaseOrder.getItems().forEach(item -> {
				Product product = item.getProduct();
				if (product.getId() == null) {
					handleNewProduct(item, product, branch);
				} else {
					handleExistingProduct(item, product);
				}
			});

			purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

			if (purchaseOrderDto.getId() == null) {
				boolean status = sequenceService.incrementSequense(branch.getId(), module.getId(), nextSequense);
			}

			return new Status(true, ((purchaseOrderDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	public Status uploadSave(PurchaseOrderDto purchaseOrderDto) {
		try {

			Module module = moduleRepository.findByName(ModuleEnum.purchase.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			PurchaseOrder purchaseOrder = new PurchaseOrder();
			Branch branch = BranchContextHolder.getCurrentBranch();
			String nextSequense = null;

			if (purchaseOrderDto.getId() == null) {
				purchaseOrder = new PurchaseOrder(purchaseOrderDto);
				purchaseOrder.setBranch(branch);
				nextSequense = sequenceService.getNextSequense(branch.getId(), module.getId());
				purchaseOrder.setUid(nextSequense);
			} else {
				purchaseOrder = this.setPurchaseOrder(purchaseOrderDto);
			}

			purchaseOrder.getItems().forEach(item -> {
				Product product = item.getProduct();
				if (product.getId() == null) {
					handleNewProduct(item, product, branch);
				} 
			});

			purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

			if (purchaseOrderDto.getId() == null) {
				boolean status = sequenceService.incrementSequense(branch.getId(), module.getId(), nextSequense);
			}

			return new Status(true, ((purchaseOrderDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}




	private void handleNewProduct(PurchaseOrderItem item, Product product, Branch branch) {
		product.setBranch(branch);
		product.setQty(item.getQty() + item.getFreeQty());
		product.setPrice(item.getMrp());
		if (item.getBatch() != null) {
			product.setBatched(true);
		}
		Product productEntity = productRepository.save(product);
		item.setProduct(productEntity);

		Batch batchNew = createBatch(item, productEntity.getId());
		batchRepository.save(batchNew);
	}

	private void handleExistingProduct(PurchaseOrderItem item, Product product) {
		var productId = product.getId();
		Optional<Product> existingProductOptional = productRepository.findByProductId(productId);

		if (existingProductOptional.isPresent()) {
			Product existingProduct = existingProductOptional.get();
			updateExistingProduct(existingProduct, item);
			ProductDto productDto=new ProductDto(existingProduct);
			productService.saveOrUpdate(productDto);
			Product productEntity =productRepository.findById(existingProduct.getId()).get();
			item.setProduct(productEntity);
		} else {
			log.info("Product not found: " + productId);
		}

		handleBatch(item, productId);
	}

	private void updateExistingProduct(Product existingProduct, PurchaseOrderItem item) {
		existingProduct.setQty(existingProduct.getQty() + item.getQty() + item.getFreeQty());
		existingProduct.setRackNo(item.getProduct().getRackNo());
		existingProduct.setPrice(item.getMrp());
	}

	private void handleBatch(PurchaseOrderItem item, Long productId) {
		Optional<Batch> existingBatchOptional = batchRepository.findByUidAndProductId(item.getBatch(), productId);
		Batch batchNew;

		if (existingBatchOptional.isPresent()) {
			batchNew = existingBatchOptional.get();
			batchNew.setQuantity(batchNew.getQuantity() + item.getQty() + item.getFreeQty());
		} else {
			batchNew = createBatch(item, productId);
		}

		batchRepository.save(batchNew);
	}

	private Batch createBatch(PurchaseOrderItem item, Long productId) {
		Batch batchNew = new Batch();
		batchNew.setUid(item.getBatch());
		batchNew.setProductId(productId);
		batchNew.setMrp(item.getMrp());
		batchNew.setRate(item.getPrice());
		batchNew.setQuantity(item.getQty() + item.getFreeQty());
		batchNew.setManufactureMonth(item.getManufactureMonth());
		batchNew.setManufactureYear(item.getManufactureYear());
		batchNew.setExpiryMonth(item.getExpiryMonth());
		batchNew.setExpiryYear(item.getExpiryYear());
		return batchNew;
	}

	private PurchaseOrder setPurchaseOrder(PurchaseOrderDto purchaseOrderDto) {
		PurchaseOrder exPurchaseOrder = purchaseOrderRepository.findById(purchaseOrderDto.getId()).get();
		exPurchaseOrder.setRemark(purchaseOrderDto.getRemark());
		exPurchaseOrder.setPaymentType(paymentTypeRepository.findById(purchaseOrderDto.getPaymentType().getId()).get());
		exPurchaseOrder.setBranch(branchRepository.findById(purchaseOrderDto.getBranch().getId()).get());
		exPurchaseOrder.setSubtotal(purchaseOrderDto.getSubtotal());
		exPurchaseOrder.setDiscount(purchaseOrderDto.getDiscount());
		exPurchaseOrder.setGrandTotal(purchaseOrderDto.getGrandTotal());
		exPurchaseOrder.setTotalDiscount(purchaseOrderDto.getTotalDiscount());
		exPurchaseOrder.setTotalGst(purchaseOrderDto.getTotalGst());
		exPurchaseOrder.setPaidAmount(purchaseOrderDto.getPaidAmount());
		exPurchaseOrder.setBalance(purchaseOrderDto.getBalance());
		exPurchaseOrder.setVendor(new Vendor(purchaseOrderDto.getVendor()));

		List<PurchaseOrderItem> items = new ArrayList<PurchaseOrderItem>();
		purchaseOrderDto.getItems().forEach(item -> {
			PurchaseOrderItem orderItem = new PurchaseOrderItem(item);
			var newQty = orderItem.getQty();
			var existingItemOpt = exPurchaseOrder.getItems().stream().filter(a -> a.getId().equals(orderItem.getId()))
					.findFirst();

			if (existingItemOpt.isPresent()) {
				orderItem.setQty(newQty);
			}

			orderItem.setPurchaseOrder(exPurchaseOrder);
			items.add(orderItem);
		});
		exPurchaseOrder.setItems(items);

		return exPurchaseOrder;

	}

	@Override
	public List<PurchaseOrderProj> getAllPurchaseOrders() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<PurchaseOrderProj> purchaseOrderList = purchaseOrderRepository
				.findAllProjectedByBranch_idOrderByIdDesc(branch.getId());
		return purchaseOrderList;
	}

	@Override
	// @Cacheable(value = "PurchaseOrderCache",keyGenerator =
	// "multiTenantCacheKeyGenerator")
	public PurchaseOrderDto getById(Long id) {
		PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto();
		try {
			Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
			if (purchaseOrder.isPresent()) {
				purchaseOrderDto = new PurchaseOrderDto(purchaseOrder.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return purchaseOrderDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
			if (!purchaseOrder.isPresent()) {
				return new Status(false, "PurchaseOrder Not Found");
			}

			purchaseOrderRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Status approveById(Long id) {
		try {
			Optional<PurchaseOrder> purchaseOrderOpt = purchaseOrderRepository.findById(id);
			if (!purchaseOrderOpt.isPresent()) {
				return new Status(false, "PurchaseOrder Not Found");
			}

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String approver = authentication.getName();

			PurchaseOrder purchaseOrder = purchaseOrderOpt.get();
			purchaseOrder.setApproved(true);
			purchaseOrder.setApprovedBy(approver);
			purchaseOrder.setApprovedTime(new Date());
			purchaseOrderRepository.save(purchaseOrder);

			paymentTransactionService.saveOrUpdate(purchaseOrderToTransaction(purchaseOrder));

			return new Status(true, "Approved Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private PaymentTransactionDto purchaseOrderToTransaction(PurchaseOrder purchaseOrder) {

		PaymentTransactionDto paymentTransactionDto = new PaymentTransactionDto();
		paymentTransactionDto.setBranch(new BranchDto(purchaseOrder.getBranch()));
		paymentTransactionDto.setWithdraw(purchaseOrder.getGrandTotal());
		paymentTransactionDto.setPaymentType(new PaymentTypeDto(purchaseOrder.getPaymentType()));
		paymentTransactionDto.setRemark(purchaseOrder.getRemark());

		return paymentTransactionDto;
	}

	public byte[] printById(Long id) {
		// HTML file to PDF
		try {
			PurchaseOrderDto purchaseOrderDto = getById(id);
			String html = generatePurchaseInvoiceHtml(purchaseOrderDto);

			ConverterProperties converterProperties = new ConverterProperties();
			converterProperties.setBaseUri(getBaseUri());
			HtmlConverter.convertToPdf(html, new FileOutputStream("temp/purchase.pdf"), converterProperties);

			byte[] pdfBytes = typeConverter.fileToByteArray(new File("temp/purchase.pdf"));
			return pdfBytes;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	private String getBaseUri() {
		String filepath = "";
		try {
			File file = ResourceUtils.getFile("classpath:" + "templates/purchase");
			Path path = file.toPath();
			filepath = path.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return filepath;
	}

	private String generatePurchaseInvoiceHtml(PurchaseOrderDto purchaseOrderDto) {

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("email", "jee@gmail.com");
		ctx.setVariable("name", "Jeebendu");
		ctx.setVariable("springLogo", "images/spring.png");
		ctx.setVariable("url", "jee.com");
		ctx.setVariable("clinicName", "AAROAH CLINIC");
		ctx.setVariable("clinicForm", "Purchase Invoice");
		ctx.setVariable("clinicLogo", "https://s3.ap-south-1.amazonaws.com/clinichub.in/tenant/aaroh/logo.png");

		ctx.setVariable("data", purchaseOrderDto);

		final String htmlContent = this.htmlTemplateEngine.process("purchase/purchase.html", ctx);
		return htmlContent;
	}

	private String extractTextFromImage(byte[] imageBytes) {
		try {
			if (1 == 1) {
				String extractedTextdummy = "L0942\r\n"
						+ "OROFER XT TAB\r\n"
						+ "2\r\n"
						+ "\r\n"
						+ "15'S\r\n"
						+ "E16GL24131\r\n"
						+ "06/25\r\n"
						+ "312.35\r\n"
						+ "223.10\r\n"
						+ "4.00\r\n"
						+ "0.00\r\n"
						+ "428.35\r\n"
						+ "12\r\n"
						+ "479.75\r\n"
						+ "EMCU\r\n"
						+ "30045020\r\n"
						+ "01180\r\n"
						+ "SEROFLO 250 INHALER\r\n"
						+ "1\r\n"
						+ "\r\n"
						+ "120MD\r\n"
						+ "4SN1237\r\n"
						+ "05/26\r\n"
						+ "887.02\r\n"
						+ "633.59\r\n"
						+ "4.00\r\n"
						+ "0.00\r\n"
						+ "608.25\r\n"
						+ "12\r\n"
						+ "681.25\r\n"
						+ "CIPL\r\n"
						+ "30049099";
				return extractedTextdummy;
			}

			Document document = Document.builder().bytes(SdkBytes.fromByteArray(imageBytes)).build();

			DetectDocumentTextRequest request = DetectDocumentTextRequest.builder().document(document).build();
			DetectDocumentTextResponse response = textractClient.detectDocumentText(request);

			StringBuilder extractedText = new StringBuilder();
			List<Block> blocks = response.blocks();
			for (Block block : blocks) {
				if (block.blockType().equals(BlockType.LINE)) {
					extractedText.append(block.text()).append("\n");
				}
			}
			String text = extractedText.toString();
			return text;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}

	// @Transactional("tenantTransactionManager")
	@Override
	public Status process(PurchaseOrderScan poOrderScan) {

		PurchaseOrderDto purchaseOrderDto = new PurchaseOrderDto();
		VendorItemColumn itemColumns = vItemColumnRepo.findByVendor_id(poOrderScan.getVendor().getId());

		List<PurchaseOrderItemDto> purchaseOrderItemDtoList = mapScannedDataToPO(poOrderScan.getItems(), itemColumns);
		purchaseOrderDto.setItems(purchaseOrderItemDtoList);
		purchaseOrderDto.setVendor(poOrderScan.getVendor());
		purchaseOrderDto.setPaymentType(poOrderScan.getPaymentType());
		purchaseOrderDto.setRemark("Auto import");
		purchaseOrderDto=setAmountInfo(purchaseOrderDto);

		purchaseOrderDto.setBranch(new BranchDto(BranchContextHolder.getCurrentBranch()));
		// Save or update the purchase order
		return this.uploadSave(purchaseOrderDto);

	}

	public PurchaseOrderDto setAmountInfo(PurchaseOrderDto pOrderDto){

		double subtotal = 0;
		double totalDiscount = 0;
		double totalGst = 0;
		double grandtotal = 0;

		for (PurchaseOrderItemDto item : pOrderDto.getItems()) {
			double subPrice=0;
			subPrice=item.getPrice()* (Optional.ofNullable(item.getProduct().getQty()).orElse(0)+Optional.ofNullable(item.getQty()).orElse(0));
			subtotal += subPrice;
			grandtotal += item.getTotal();
			totalDiscount +=( (subPrice)*( item.getDiscountPercent()/100));//calculate discount of a single item and then findout its sum
			totalGst += ( subPrice - ( subPrice*( item.getDiscountPercent()/100)) ) * ( item.getGstPercent()/100);//calculate total gst of a single item and then findout its sum
		}

		pOrderDto.setSubtotal(subtotal);
		pOrderDto.setTotalDiscount(totalDiscount);
		pOrderDto.setTotalGst(totalGst);
		pOrderDto.setGrandTotal(grandtotal);

		return pOrderDto;
	}


	private List<PurchaseOrderItemDto> mapScannedDataToPO(List<PurchaseOrderScanItem> items,
			VendorItemColumn itemColumns) {
		return items.stream()
				.map(item -> setScanItemToPurchaseItem(item, itemColumns))
				.collect(Collectors.toList());
	}

	public PurchaseOrderItemDto setScanItemToPurchaseItem(PurchaseOrderScanItem scanItem,
			VendorItemColumn itemColumns) {

		PurchaseOrderItemDto pItemDto = new PurchaseOrderItemDto();

		ExpiryDate expiryDate = parseExpiryDate(scanItem.getExpiryDate(), itemColumns.getExpSeparator());

		Batch  batch=batchRepository.findByUid(scanItem.getBatch());
		if(batch!=null) {
			Optional<Product> product=productRepository.findByProductId(batch.getProductId());
			if(product.isPresent()) {
				pItemDto.setQty(Optional.ofNullable(scanItem.getQty()).map(Integer::parseInt).orElse(null));
				pItemDto=setItemPrice(scanItem,product.get(),pItemDto);
				product.get().setQty(product.get().getQty()+pItemDto.getQty());
				pItemDto.setProduct(new ProductDto(product.get()));
			}
		}else{
			pItemDto.setQty(Optional.ofNullable(scanItem.getQty()).map(Integer::parseInt).orElse(null));
			ProductDto product = new ProductDto();
			product.setName(scanItem.getName());
			pItemDto.setProduct(product);
			pItemDto.setTotal(Optional.ofNullable(scanItem.getTotal()).map(Double::parseDouble).orElse(null));
		}
		pItemDto.setBatch(scanItem.getBatch());
		pItemDto.setId(Optional.ofNullable(scanItem.getId()).map(Long::parseLong).orElse(null));
		pItemDto.setPrice(Optional.ofNullable(scanItem.getPrice()).map(Double::parseDouble).orElse(null));
		pItemDto.setMrp(Optional.ofNullable(scanItem.getMrp()).map(Double::parseDouble).orElse(null));
		pItemDto.setExpiryMonth(Optional.ofNullable(expiryDate).map(date -> date.getMonth()).orElse(null));
		pItemDto.setExpiryYear(Optional.ofNullable(expiryDate).map(date -> date.getYear()).orElse(null));
		pItemDto.setManufactureMonth(
				Optional.ofNullable(scanItem.getManufactureMonth()).map(Integer::parseInt).orElse(null));
		pItemDto.setManufactureYear(
				Optional.ofNullable(scanItem.getManufactureYear()).map(Integer::parseInt).orElse(null));
		pItemDto.setFreeQty(Optional.ofNullable(scanItem.getFreeQty())
				.filter(freeQty -> !freeQty.isEmpty())
				.map(Integer::parseInt)
				.orElse(0));
		pItemDto.setDiscountPercent(
				Optional.ofNullable(scanItem.getDiscountPercent()).map(Double::parseDouble).orElse(null));
		
		pItemDto.setDiscountAmount(
				Optional.ofNullable(scanItem.getDiscountAmount()).map(Double::parseDouble).orElse(0.0));
		pItemDto.setGstPercent(Optional.ofNullable(scanItem.getGstPercent()).map(Double::parseDouble).orElse(null));
		pItemDto.setTaxAmount(Optional.ofNullable(scanItem.getTaxAmount()).map(Double::parseDouble).orElse(0.0));
		pItemDto.setHsnCode(scanItem.getHsnCode());
		pItemDto.setPack(scanItem.getPack());
		pItemDto.setMfg(scanItem.getMfg());

		return pItemDto;
	}


	public PurchaseOrderItemDto setItemPrice(PurchaseOrderScanItem scanItem,Product product,PurchaseOrderItemDto pItemDto){
		double subPricePrev = 0;
		double subPriceCurr = 0;
		double totalDiscountPrev = 0;
		double totalDiscountCurr = 0;
		double totalGstPrev = 0;
		double totalGstCurr = 0;
		double totalPrev = 0;
		double totalCurr = 0;
	
		totalDiscountPrev =( (Double.parseDouble(scanItem.getPrice())*product.getQty())*(Double.parseDouble( scanItem.getDiscountPercent())/100));//calculate discount of a prev item 
		totalDiscountCurr =(Double.parseDouble(scanItem.getPrice())*Double.parseDouble(scanItem.getQty()))*(Double.parseDouble( scanItem.getDiscountPercent())/100);//calculate discount of a current item 

		subPriceCurr=(Double.parseDouble(scanItem.getPrice())*Double.parseDouble(scanItem.getQty()))-totalDiscountCurr;
		subPricePrev=(Double.parseDouble(scanItem.getPrice())*product.getQty())-totalDiscountPrev;


    totalGstPrev =subPricePrev*(Double.parseDouble( scanItem.getGstPercent())/100);//calculate total gst of a single item and then findout its sum
    totalGstCurr =subPriceCurr*(Double.parseDouble( scanItem.getGstPercent())/100);//calculate total gst of a single item and then findout its sum
	totalPrev=totalGstPrev+subPricePrev;
	totalCurr=totalGstCurr+subPriceCurr;
	pItemDto.setTotal(totalPrev+totalCurr);

		return pItemDto;
	}

	@Override
	public PurchaseOrderScan scan(byte[] imageBytes) {

		String text = extractTextFromImage(imageBytes);

		PurchaseOrderScan purchaseOrderScan = new PurchaseOrderScan();
		Vendor vendor = getVendorByGST(text);

		List<PurchaseOrderScanItem> purchaseOrderItemDtoList = mapExtractedTextToPurchaseOrderItems(text, vendor);
		purchaseOrderScan.setItems(purchaseOrderItemDtoList);
		purchaseOrderScan.setVendor(new VendorDto(vendor));
		purchaseOrderScan.setRemark("Auto import");

		// return this to frontend confirm by user to verify if extract is correct or
		// not
		return purchaseOrderScan;
	}

	public Vendor getVendorByGST(String text) {
		text = "29AAACF4043R1Z7";
		List<Vendor> vendorList = extractVendorByGST(text);
		if (vendorList.isEmpty()) {
			throw new EntityNotFoundException("Distributor not found by GST");
		} else if (vendorList.size() > 1) {
			throw new EntityNotFoundException("Multiple Distributor found");
		} else {
			return vendorList.get(0);
		}
	}

	public List<PurchaseOrderScanItem> mapExtractedTextToPurchaseOrderItems(String extractedText, Vendor vendor) {
		
		log.info(extractedText);
		
		List<PurchaseOrderScanItem> purchaseOrderScanItems = new ArrayList<>();
		String[] lines = extractedText.split("\\r?\\n");
		VendorItemColumn itemColumns = vItemColumnRepo.findByVendor_id(vendor.getId());
		// int totalColumns = itemColumns.getItemLength(); // Each item has 16 columns
		int totalColumns =16; // Each item has 16 columns
		String startPoint = itemColumns.getStartPoint();

		// Find the starting index of the first item (L0942)
		int startIndex = -1;
		for (int i = 0; i < lines.length; i++) {
			if (lines[i].trim().equals(startPoint)) {
				startIndex = i; 
				break;
			}
		}

		if (startIndex == -1) {
			startIndex =0;
			//log.info("No items found starting with startPoint");
			//return purchaseOrderScanItems;
		}

		// Iterate through the lines starting from the first item
		for (int i = startIndex; i < lines.length; i += totalColumns) { 
			if (i + totalColumns <= lines.length) { // Ensure there are enough lines for a complete item
				PurchaseOrderScanItem item = new PurchaseOrderScanItem();

				if (itemColumns.getHsn() != -1 && i + itemColumns.getHsn() < lines.length) {
					item.setHsnCode(lines[i + itemColumns.getHsn()].trim());
				}
				if (itemColumns.getMfg() != -1 && i + itemColumns.getMfg() < lines.length) {
					item.setMfg(lines[i + itemColumns.getMfg()].trim());
				}
				if (itemColumns.getName() != -1 && i + itemColumns.getName() < lines.length) {
					item.setName(lines[i + itemColumns.getName()].trim());
				}
				if (itemColumns.getPack() != -1 && i + itemColumns.getPack() < lines.length) {
					item.setPack(lines[i + itemColumns.getPack()].trim());
				}
				if (itemColumns.getBatch() != -1 && i + itemColumns.getBatch() < lines.length) {
					item.setBatch(lines[i + itemColumns.getBatch()].trim());
				}
				if (itemColumns.getExp() != -1 && i + itemColumns.getExp() < lines.length) {
					item.setExpiryDate(lines[i + itemColumns.getExp()].trim());
				}
				if (itemColumns.getMrp() != -1 && i + itemColumns.getMrp() < lines.length) {
					item.setMrp(lines[i + itemColumns.getMrp()].trim());
				}
				if (itemColumns.getQty() != -1 && i + itemColumns.getQty() < lines.length) {
					item.setQty(lines[i + itemColumns.getQty()].trim());
				}
				if (itemColumns.getFree() != -1 && i + itemColumns.getFree() < lines.length) {
					item.setFreeQty(lines[i + itemColumns.getFree()].trim());
				}
				if (itemColumns.getRate() != -1 && i + itemColumns.getRate() < lines.length) {
					item.setPrice(lines[i + itemColumns.getRate()].trim());
				}
				if (itemColumns.getDis() != -1 && i + itemColumns.getDis() < lines.length) {
					item.setDiscountPercent(lines[i + itemColumns.getDis()].trim());
				}
				if (itemColumns.getSgst() != -1 && i + itemColumns.getSgst() < lines.length) {
					item.setGstPercent(lines[i + itemColumns.getSgst()].trim());
				}
				// if (itemColumns.getCgst() != -1 && i + itemColumns.getCgst() < lines.length) {
				// 	item.setGstPercent(lines[i + itemColumns.getCgst()].trim());
				// }
				if (itemColumns.getNetAmount() != -1 && i + itemColumns.getNetAmount() < lines.length) {
					item.setTotal(lines[i + itemColumns.getNetAmount()].trim());
				}
				
				log.info("item added : " + i);
				
				purchaseOrderScanItems.add(item);
			} else {
				// Handle error: not enough lines for a complete item
				log.info("Incomplete item data starting at line: " + i);
			}
		}

		return purchaseOrderScanItems;
	}

	private ExpiryDate parseExpiryDate(String expiryDateStr, String expSeparator) {
		// Implement the logic to parse the expiry date string and return an ExpiryDate
		// object
		// For example, if the expiry date is in the format "MM/YY":
		String[] parts = expiryDateStr.split(expSeparator);
		if (parts.length != 2) {
			throw new IllegalArgumentException("Invalid expiry date format: " + expiryDateStr);
		}

		// Parse month and year
		int month = Integer.parseInt(parts[0].trim());
		int year = Integer.parseInt(parts[1].trim());

		// Ensure the year is in 4 digits
		if (year < 100) {
			year += 2000; // Assuming the year is in the 21st century
		}

		// Ensure the month is valid
		if (month < 1 || month > 12) {
			throw new IllegalArgumentException("Invalid month value: " + month);
		}

		return new ExpiryDate(month, year);
	}

	public void getApproveTime(String text, PurchaseOrder purchaseOrder) {

		Pattern pattern = Pattern.compile("Date\\s*:\\s*(\\d{2}-\\d{2}-\\d{4})");
		Matcher matcher = pattern.matcher(text);
		if (matcher.find()) {
			String dateStr = matcher.group(1);
			String[] dateParts = dateStr.split("-");
			int day = Integer.parseInt(dateParts[0]);
			int month = Integer.parseInt(dateParts[1]) - 1; // Months are 0-based in Java's Date class
			int year = Integer.parseInt(dateParts[2]);

			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month, day, 0, 0, 0);
			Date dateObj = calendar.getTime();
			purchaseOrder.setApprovedTime(dateObj);
		}
	}

	public void setPurchaseOrderAmountInfo(PurchaseOrderDto purchaseOrderDto) {

		double subtotal = 0;
		double totalDiscount = 0;
		double totalGst = 0;

		purchaseOrderDto.setSubtotal(subtotal);
		purchaseOrderDto.setTotalDiscount(totalDiscount);
		purchaseOrderDto.setTotalGst(totalGst);
		purchaseOrderDto.setGrandTotal((subtotal + totalGst) - totalDiscount);
	}

	public int findSlNo(String slno) {
		int no = 0;
		try {
			no = Integer.parseInt(slno.replace(".", ""));
		} catch (Exception e) {
		}
		return no;
	}

	public int findIntioalPoint(String[] lines, String startingWord) {
		int no = 0;
		for (int i = 0; i < lines.length; i++) {
			if (lines[i].equals(startingWord)) {
				no = i;
				break;
			}
		}
		return no;
	}

	public int getLoopTime(String[] lines, int startPoint) {
		int no = 0;
		for (int i = startPoint; i < lines.length; i++) {

			String wordFound = lines[i].replace(".", "");
			try {
				Integer.parseInt(wordFound);
				break;
			} catch (NumberFormatException e) {
			} finally {
				no++;
			}
		}

		return no;
	}

	public List<PurchaseOrderItem> findPurchaseOrderItem(String text, Long vendorId) {

		VendorItemColumn itemColumns = vItemColumnRepo.findByVendor_id(vendorId);

		List<PurchaseOrderItem> items = new ArrayList<>();
		String[] lines = text.split("\\r?\\n");
		int startingPoint = findIntioalPoint(lines, itemColumns.getStartPoint());
		int getLoopTime = getLoopTime(lines, startingPoint);
		int removeIf = 0;
		int loop = 0;
		int i = (startingPoint + getLoopTime) - 1;
		int currentSl = findSlNo(lines[(startingPoint + getLoopTime) - 1]);
		int nextSlNo = currentSl;
		int counter = 0;
		PurchaseOrderItem item = new PurchaseOrderItem();
		while (currentSl == nextSlNo && currentSl < 7) {
			removeIf++;
			if (removeIf == getLoopTime - 1) {
				nextSlNo = currentSl + 1;
				currentSl = findSlNo(lines[i + 1]);
				items.add(item);
				item = new PurchaseOrderItem();
				removeIf = 0;
				loop += getLoopTime - 1;
				counter = 1;
				i++;
			} else {
				initializedItem(((startingPoint + getLoopTime) - 1) + loop, counter, lines, item, itemColumns);
				i++;
				counter++;
			}
		}
		return items;
	}

	public void initializedItem(int s, int i, String[] lines, PurchaseOrderItem item, VendorItemColumn itemColumns) {
		int hsnPosition = itemColumns.getHsn();
		int mfgPosition = itemColumns.getMfg();
		int packPosition = itemColumns.getPack();
		int batchPosition = itemColumns.getBatch();
		int expPosition = itemColumns.getExp();
		int mrpPosition = itemColumns.getMrp();
		int qtyFrPosition = itemColumns.getQty();
		int freePosition = itemColumns.getFree();
		int amountPosition = itemColumns.getAmount();
		int disPosition = itemColumns.getDis();
		int cgstPosition = itemColumns.getCgst();
		int sgstPosition = itemColumns.getSgst();
		int netAmtPosition = itemColumns.getNetAmount();
		int itemNamePosition = itemColumns.getName();
		String expSeparator = itemColumns.getExpSeparator();

		if (hsnPosition != -1 && i == hsnPosition - 1) {
			item.setHsnCode(lines[s + i]);
		}
		if (mfgPosition != -1 && i == mfgPosition - 1) {
			item.setMfg(lines[s + i]);
		}
		if (packPosition != -1 && i == packPosition - 1) {
			item.setPack(lines[s + i]);
		}
		if (batchPosition != -1 && i == batchPosition - 1) {
			item.setBatch(lines[s + i]);
		}
		if (expPosition != -1 && i == expPosition - 1 && lines[s + i].contains(expSeparator)) {
			setExpiryDate(item, lines[s + i], expSeparator);
		}
		if (mrpPosition != -1 && i == mrpPosition - 1) {
			item.setMrp(Double.parseDouble(lines[s + i]));
		}
		if (freePosition != -1 && i == freePosition - 1) {
			item.setFreeQty(Integer.parseInt(lines[s + i]));
		}
		if (qtyFrPosition != -1 && i == qtyFrPosition - 1) {
			int qty = calculateQuantity(lines[s + i]);
			item.setQty(qty);
			item.getProduct().setQty(qty);
		}
		if (amountPosition != -1 && i == amountPosition - 1) {
			double price = Double.parseDouble(lines[s + i]);
			item.setPrice(price);
			item.getProduct().setPrice(price);
		}
		if (disPosition != -1 && i == disPosition - 1) {
			item.setDiscountPercent(Double.parseDouble(lines[s + i]));
		}
		if (cgstPosition != -1 && i == cgstPosition - 1) {
			item.setGstPercent(item.getGstPercent() + Double.parseDouble(lines[s + i]));
		}
		if (sgstPosition != -1 && i == sgstPosition - 1) {
			item.setGstPercent(item.getGstPercent() + Double.parseDouble(lines[s + i]));
		}
		if (netAmtPosition != -1 && i == netAmtPosition - 1) {
			item.setTotal(Double.parseDouble(lines[s + i]));
		}
		if (itemNamePosition != -1 && i == itemNamePosition - 1) {
			// setProductDetails(item, lines, s, i, mfgPosition, qtyFrPosition);
		}
	}

	private void setExpiryDate(PurchaseOrderItem item, String line, String expSeparator) {
		String[] parts = line.split(expSeparator);
		item.setExpiryMonth(Integer.parseInt(parts[0]));
		item.setExpiryYear(Integer.parseInt(parts[1]));
	}

	private int calculateQuantity(String line) {
		int qty = 0;
		for (String val : line.split("\\+")) {
			qty += Integer.parseInt(val);
		}
		return qty;
	}

	public List<Vendor> extractVendorByGST(String text) {
		List<Vendor> vendorList = new ArrayList<Vendor>();
		List<String> gstNumbers = findGst(text);
		if (!gstNumbers.isEmpty()) {
			vendorList = vendorRepository.findByGstIn(gstNumbers);
		}
		return vendorList;
	}

	public List<String> findGst(String text) {
		String gstNumberPattern = "\\b\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}\\b";
		Pattern pattern = Pattern.compile(gstNumberPattern);
		Matcher matcher = pattern.matcher(text);

		List<String> gstNumbers = new ArrayList<>();
		while (matcher.find()) {
			gstNumbers.add(matcher.group());
		}
		return gstNumbers;
	}

    @Override
	public 	Page<PurchaseOrderProj> search(Search search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		return purchaseOrderRepository.search(
			pr,
			branch.getId(),
			search.getPaymentType(),
			search.getVendorName(),
			search.getApproved()
			// search.getFromDate(),
			// search.getToDate(),
		);
	}
}
