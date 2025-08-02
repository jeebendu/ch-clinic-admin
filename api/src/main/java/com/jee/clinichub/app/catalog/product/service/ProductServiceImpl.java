package com.jee.clinichub.app.catalog.product.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.catalog.batch.model.Batch;
import com.jee.clinichub.app.catalog.batch.model.BatchDto;
import com.jee.clinichub.app.catalog.batch.repository.BatchRepository;
import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.repository.BrandRepository;
import com.jee.clinichub.app.catalog.category.model.Category;
import com.jee.clinichub.app.catalog.category.repository.CategoryRepository;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.app.catalog.product.model.ProductProj;
import com.jee.clinichub.app.catalog.product.model.ProductSearch;
import com.jee.clinichub.app.catalog.product.model.ProductSearchProj;
import com.jee.clinichub.app.catalog.product.model.ProductSerial;
import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;
import com.jee.clinichub.app.catalog.product.repository.ProductRepository;
import com.jee.clinichub.app.catalog.product.repository.ProductViewRepo;
import com.jee.clinichub.app.catalog.type.model.ProductType;
import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.DateUtility;

@Service(value = "productService")
public class ProductServiceImpl implements ProductService {

	private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private BranchRepository branchRepository;

	@Autowired
	BatchRepository batchRepository;

	@Autowired
	DateUtility dateUtility;

	@Autowired
	ProductViewRepo productViewRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private BrandRepository brandRepository;

	@Override
	public Status saveOrUpdate(ProductDto productDto) {
		try {

			boolean isExistName = (productDto.getId() == null) ? productRepository.existsByName(productDto.getName())
					: productRepository.existsByNameAndIdNot(productDto.getName(), productDto.getId());

			if (isExistName) {
				return new Status(false, "Product  already exist");
			}

			Product product = (productDto.getId() == null)
			? new Product(productDto)
			: setProduct(productDto);

			if (productDto.getId() == null) {
				product = new Product(productDto);
			} else {
				product = this.setProduct(productDto);
			}

			Branch branch = BranchContextHolder.getCurrentBranch();
			if (branch == null) {
				return new Status(false, "Branch not found");
			}
			product.setBranch(branch);
			product.setCategory(categoryRepository.findCategoryById(productDto.getCategory().getId()));
			product.setBrand(brandRepository.findBrandById(productDto.getBrand().getId()));

			List<Batch> activeBatchList = productDto.getBatchList().stream()
					.filter(b -> !b.isDelete())
					.map(Batch::new).collect(Collectors.toList());

			List<Batch> deleteBatchList = productDto.getBatchList().stream()
					.filter(b -> b.isDelete())
					.map(Batch::new).collect(Collectors.toList());

			if (product.isBatched()) {
				int batchedQty = activeBatchList.stream().mapToInt(o -> o.getQuantity()).sum();

				List<Batch> _activeBatchList = activeBatchList.stream()
						.filter(b -> b.getQuantity() > 0)
						.sorted(Comparator.comparing(Batch::getExpiryYear)
								.thenComparing(Batch::getExpiryMonth))
						.parallel().collect(Collectors.toList());

				// List<Batch> lowExpiryBatch =
				// activeBatchList.stream().filter(b->b.getQuantity()>0).collect(Collectors.toList());
				product.setQty(batchedQty);

				if (product.getType().isStrip()) {
					int batchedQtyLoose = activeBatchList.stream().mapToInt(o -> o.getQtyLoose()).sum();
					product.setQtyLoose(batchedQtyLoose);
				}

				if (_activeBatchList.size() > 0) {
					product.setPrice(_activeBatchList.get(0).getMrp());
				}

			}

			product = productRepository.save(product);
			Product _product = product;

			activeBatchList.stream().peek(batch -> batch.setProductId(_product.getId())).collect(Collectors.toList());
			deleteBatchList.stream().peek(batch -> batch.setProductId(_product.getId())).collect(Collectors.toList());

			batchRepository.saveAll(activeBatchList);
			batchRepository.deleteAll(deleteBatchList);

			return new Status(true, ((productDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Product setProduct(ProductDto productDto) {
		Product exProduct = productRepository.findById(productDto.getId()).get();
		exProduct.setName(productDto.getName());
		exProduct.setRackNo(productDto.getRackNo());
		exProduct.setQty(productDto.getQty());
		exProduct.setBrand(new Brand(productDto.getBrand()));
		exProduct.setCategory(new Category(productDto.getCategory()));
		exProduct.setPrice(productDto.getPrice());
		exProduct.setBatched(productDto.isBatched());
		exProduct.setCapPerStrip(productDto.getCapPerStrip());
		exProduct.setStripsPerBox(productDto.getStripsPerBox());
		exProduct.setType(new ProductType(productDto.getType()));

		List<ProductSerial> serials = new ArrayList<ProductSerial>();
		productDto.getSerials().forEach(serialDto -> {
			ProductSerial serial = new ProductSerial(serialDto);
			serial.setProduct(exProduct);
			serials.add(serial);
		});

		exProduct.setSerials(serials);
		return exProduct;

	}

	@Override
	public List<ProductProj> getAllProducts() {

		Branch branch = BranchContextHolder.getCurrentBranch();
		if (branch == null || branch.getId() == null)
			return new ArrayList();

		List<ProductProj> productList = productRepository.findAllProjectedByBranch_IdOrderByNameAsc(branch.getId());
		return productList;
	}

	@Override
	public List<ProductProj> searchProducts(Search search) {

		Branch branch = BranchContextHolder.getCurrentBranch();
		if (branch == null || branch.getId() == null)
			return new ArrayList();

		Long categoryId = search.getCategory() == null ? null
				: search.getCategory().getId() == 0L ? null : search.getCategory().getId();
		Long brandId = search.getBrand() == null ? null
				: search.getBrand().getId() == 0L ? null : search.getBrand().getId();

		Integer qtyFrom = 0;
		Integer qtyTo = 0;

		if (search.getAvailable() == 0L) {
			qtyTo = 999999999;
		} // All
		if (search.getAvailable() == 1L) {
			qtyTo = 0;
		} // Out of stock
		if (search.getAvailable() == 2L) {
			qtyFrom = 1;
			qtyTo = 3;
		} // Low stock
		if (search.getAvailable() == 3L) {
			qtyFrom = 4;
			qtyTo = 999999999;
		} // Available

		// Date expiryRange = dateUtility.addMonth(search.getExpiry());
		// int exMonth = dateUtility.getMonth(expiryRange);
		// int exYear = dateUtility.getYear(expiryRange);

		Integer expiry = search.getExpiry();
		expiry = expiry == -1 ? null : expiry;

		List<ProductProj> productList = null;//productRepository.findAllProjectedBySearch(branch.getId(), search.getName(),categoryId, brandId, qtyFrom, qtyTo, expiry);
		return productList;
	}

	@Override
	public Product findByName(String name) {
		Product product = productRepository.findProductByName(name);
		return product;
	}

	@Override
	public ProductDto getById(Long id) {
		ProductDto productDto = new ProductDto();
		try {
			Optional<Product> product = productRepository.findById(id);
			if (product.isPresent()) {
				productDto = new ProductDto(product.get());
				List<BatchDto> batchList = batchRepository.findByProductId(productDto.getId()).stream()
						.map(BatchDto::new).collect(Collectors.toList());

				productDto.setBatchList(batchList);
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return productDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Product> product = productRepository.findById(id);

			if (!product.isPresent()) {
				return new Status(false, "Product Not Found");
			}
			// batchRepository.deleteAllByProductId(id);
			productRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	@CacheEvict(value = "productCache", allEntries = true)
	public boolean updateQty(Product oProduct) {

		try {
			Optional<Product> opProduct = productRepository.findById(oProduct.getId());
			if (opProduct.isPresent()) {
				Product product = opProduct.get();

				product.getSerials().forEach(serial -> {
					oProduct.getSerials().forEach(oSerial -> {
						if (oSerial.getId() == serial.getId()) {
							int index = product.getSerials().indexOf(serial);
							serial.setQty(0);
							product.getSerials().set(index, serial);
						}
					});

				});
				if (product.getSerials().size() > 0) {
					product.setQty(product.getQty() - oProduct.getQty());
				} else {
					product.setQty(product.getQty() - oProduct.getQty());
				}

				productRepository.save(product);
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return false;
	}

	@Override
	public List<ProductSearchProj> searchProductsByName(Search search) {

		Branch branch = BranchContextHolder.getCurrentBranch();
		if (branch == null || branch.getId() == null)
			return new ArrayList();

		List<ProductSearchProj> productList = productRepository
				.findAllProjectedByBranch_IdAndNameContainingIgnoreCaseOrderByNameDesc(branch.getId(),
						search.getName());
		return productList;
	}

	public Page<ProductViewDTO> filterProduct(int page, int size, ProductSearch search) {
		Pageable pr = PageRequest.of(page, size);

		Branch branch = BranchContextHolder.getCurrentBranch();

		Integer qtyFrom = 0;
        Integer qtyTo = Integer.MAX_VALUE;

        if (search.getAvailable() == 0L) {
            qtyTo = Integer.MAX_VALUE;
        } // All
        if (search.getAvailable() == 2L) {
            qtyTo = 0;
        } // Out of stock
        if (search.getAvailable() == 3L) {
            qtyFrom = 1;
            qtyTo = 3;
        } // Low stock
        if (search.getAvailable() == 1L) {
            qtyFrom = 4;
            qtyTo = Integer.MAX_VALUE;
        } // Available

		Integer expiry = search.getExpiry();
		expiry = (expiry != null && expiry == -1) ? null : expiry;

		return productViewRepository.filterProducts(
				pr,
				branch.getId(),
				search.getName(),
				search.getCategory() != null ? search.getCategory().getId() : null,
				search.getBrand() != null ? search.getBrand().getId() : null,
				search.getType() != null ? search.getType().getId() : null,
				qtyFrom,
				qtyTo,
				expiry);
	}

}
