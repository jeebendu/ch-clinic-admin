package com.jee.clinichub.app.admin.promo.coupons.service;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.admin.promo.coupons.model.Coupons;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsDto;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsProjection;
import com.jee.clinichub.app.admin.promo.coupons.model.CouponsSearch;
import com.jee.clinichub.app.admin.promo.coupons.repository.CouponsRepo;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class CouponsServiceImpl  implements CouponsService {


    private final CDNProviderService cdnProviderService;

    public final String FS = "/";

    @Value("${upload.root.folder}")
    private String TENANT_ROOT;

    private final CouponsRepo couponsRepository; 



      public List<CouponsDto> findAll() {
       return couponsRepository.findAll().stream().map(CouponsDto::new).toList();
    }

    @Override
    public CouponsDto getById(Long id) {
    
    return couponsRepository.findById(id).map(CouponsDto::new)
    .orElseThrow(() -> new EntityNotFoundException("Coupons not found with ID: " + id));
    }


        public Status deleteById(Long id) {
            couponsRepository.findById(id).ifPresentOrElse(
                state ->{
                    couponsRepository.deleteById(id);
                },
                ()->{
                    throw new EntityNotFoundException("coupons not found with ID: "+id);
                });
            return new Status(true, "Deleted Successfully");
            
        }


        public Status saveOrUpdate(MultipartFile file, CouponsDto couponsDto) {
        try{
            boolean nameExists = couponsRepository.existsByNameIgnoreCaseAndIdNot(couponsDto.getName(), couponsDto.getId()!=null?couponsDto.getId():-1);
           
            if (nameExists) {
                return new Status(false, "Coupons already exists");
            }
    
             Coupons coupons =couponsDto.getId() == null ? new Coupons(couponsDto)
                    : this.setCoupons(couponsDto);

            if (file != null) {
                if (!(file.isEmpty())) {
                    coupons.setImage(this.uploadProfile(file));
                }
            }
    
            couponsRepository.save(coupons);
                return new Status(true, couponsDto.getId() == null ? "Added Successfully" : "Updated Successfully");
            } 
            
            catch (Exception e) 
            {
                log.error("Error saving or updating coupons: {}", e.getMessage(), e);
                return new Status(false, "An error occurred");
            }
       

    }

    private Coupons setCoupons(CouponsDto couponsDto) {
		return couponsRepository.findById(couponsDto.getId())
				.map(existingCoupons -> {
					existingCoupons.setName(couponsDto.getName());
                    existingCoupons.setCodee(couponsDto.getCodee());  
                    existingCoupons.setDiscount(couponsDto.getDiscount());
                    existingCoupons.setDiscountType(couponsDto.getDiscountType());
                    existingCoupons.setStartDate(couponsDto.getStartDate());
                    existingCoupons.setEndDate(couponsDto.getEndDate());
                    existingCoupons.setMinOrderAmount(couponsDto.getMinOrderAmount());
                    existingCoupons.setMaxDiscount(couponsDto.getMaxDiscount());
                    existingCoupons.setLimitPerUser(couponsDto.getLimitPerUser());
                    // existingCoupons.setImage(couponsDto.getImage());
                    existingCoupons.setDescription(couponsDto.getDescription());

                 
                    
					return existingCoupons;
				}).orElseThrow(() -> new EntityNotFoundException("coupons not found with ID: " + couponsDto.getId()));
	}




        public String uploadProfile(MultipartFile multiSlider) {
        try {
            String tenantPath = TENANT_ROOT + FS + "clinichub";
            String isPublicOrPrivate = "public";
            String sliderName = String.format("%s", multiSlider.getOriginalFilename());
            String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;
            try {
                return cdnProviderService.upload(multiSlider, sliderPath);
            } catch (AmazonServiceException e) {
                log.error(e.getMessage());
                return null;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }

    }

    public Page<CouponsProjection> searchByAdmin(Pageable pageable,CouponsSearch couponsSearch) {
     
        Long discount = couponsSearch.getDiscount() != null ? couponsSearch.getDiscount() : null;
        String name = couponsSearch.getName() != null ? couponsSearch.getName() : null;
        String code =  couponsSearch.getCodee() != null ? couponsSearch.getCodee() : null;
        String discountType = couponsSearch.getDiscountType() != null ? couponsSearch.getDiscountType() : null;
        // Date startDate = couponsSearch.getStartDate() != null ? couponsSearch.getStartDate() : null;
        // Date endDate = couponsSearch.getEndDate() != null ? couponsSearch.getEndDate() : null;
        Long minOrderAmount = couponsSearch.getMinOrderAmount() != null ? couponsSearch.getMinOrderAmount() : null;
        Long maxDiscount = couponsSearch.getMaxDiscount() != null ? couponsSearch.getMaxDiscount() : null;
        Integer limitPerUser = couponsSearch.getLimitPerUser() != null ? couponsSearch.getLimitPerUser() : null;
        
        return couponsRepository.findAdminByNameAndDiscountTypeByCodeAndTime(pageable, discount,name,code, discountType, minOrderAmount, maxDiscount, limitPerUser);
    }


	
    
}
