package com.jee.clinichub.app.catalog.brand.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.brand.model.Search;
import com.jee.clinichub.app.catalog.brand.repository.BrandRepository;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.global.model.Status;

@Service(value = "brandService")
public class BrandServiceImpl implements BrandService {
	
	private static final Logger log = LoggerFactory.getLogger(BrandServiceImpl.class);

    @Autowired
    private BrandRepository brandRepository;
    
	@Override
	public Status saveOrUpdate(BrandDto brandDto) {
		try{
			
			boolean isExistName = (brandDto.getId()==null) ? brandRepository.existsByName(brandDto.getName()): brandRepository.existsByNameAndIdNot(brandDto.getName(),brandDto.getId());
			
			if(isExistName){return new Status(false,"Brand Name already exist");
	    	}
			
			Brand brand = new Brand();
			
			if(brandDto.getId()==null) {
				brand = new Brand(brandDto);
			}else{
				brand = this.setBrand(brandDto);
			}
			
			brand = brandRepository.save(brand);
			return new Status(true,( (brandDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Brand setBrand(BrandDto brandDto) {
    	Brand exBrand = brandRepository.findById(brandDto.getId()).get();
    	exBrand.setName(brandDto.getName());
		return exBrand;
		
	}

	@Override
  	public List<BrandDto> getAllBrands() {
    	List<Brand> brandList = brandRepository.findByOrderByNameAsc();
    	List<BrandDto> brandDtoList = brandList.stream().map(BrandDto::new).collect(Collectors.toList());
  		return brandDtoList;
  	}

    @Override
    public Brand findByName(String name) {
        Brand brand = brandRepository.findBrandByName(name);
        return brand;
    }
    
    
	@Override
	public BrandDto getById(Long id) {
		BrandDto brandDto = new BrandDto();
		try{
			Optional<Brand> brand = brandRepository.findById(id);
			if(brand.isPresent()){
				brandDto = new BrandDto(brand.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return brandDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Brand> brand = brandRepository.findById(id);
			if(!brand.isPresent()){
				return new Status(false,"Brand Not Found");
			}
			
			brandRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

		@Override
	public 	Page<Brand> search(Search search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		return brandRepository.search(
			pr,
			search.getValue()
			);
	}

	
}
