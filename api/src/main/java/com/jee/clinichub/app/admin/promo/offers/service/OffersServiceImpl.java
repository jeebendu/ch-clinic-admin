package com.jee.clinichub.app.admin.promo.offers.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.admin.promo.offers.model.OfferProjection;
import com.jee.clinichub.app.admin.promo.offers.model.Offers;
import com.jee.clinichub.app.admin.promo.offers.model.OffersDto;
import com.jee.clinichub.app.admin.promo.offers.model.OffersSearch;
import com.jee.clinichub.app.admin.promo.offers.repository.OffersRepo;
import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.app.admin.subscription.plan.repository.PlanRepository;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class OffersServiceImpl implements OffersService {

    private final CDNProviderService cdnProviderService;

    public final String FS = "/";

    @Value("${upload.root.folder}")
    private String TENANT_ROOT;

    private final OffersRepo offersRepository;
    private final PlanRepository planRepository;

    public List<OffersDto> findAll() {


                List<OffersDto> offersList = offersRepository.findAll().stream()
                .map(OffersDto::new)
                .toList();

                Set<PlanDto> planList = planRepository.findAll().stream()
                .map(PlanDto::new)
                .collect(Collectors.toSet());

        offersList.forEach(offers -> {
            planList.forEach(plan -> {
                boolean isPresent = offers.getPlanList().stream()
                        .anyMatch(offersPlan -> offersPlan.getId().equals(plan.getId()));
                plan.setActive(isPresent);
            });
            offers.setPlanList(planList);
        });
        return offersList;
    }

    // @Override
    // public OffersDto getById(Long id) {

    //     return offersRepository.findById(id).map(OffersDto::new)
    //             .orElseThrow(() -> new EntityNotFoundException("Offers not found with ID: " + id));
    // }
    @Override
    public OffersDto getById(Long id) {

        OffersDto offersDto = offersRepository.findById(id).map(OffersDto::new)
        .orElseThrow(() -> new EntityNotFoundException("Offers not found with ID: " + id));

Set<PlanDto> planList = planRepository.findAll().stream()
        .map(PlanDto::new)
        .collect(Collectors.toSet());


        planList.forEach(plan -> {
            boolean isPresent = offersDto.getPlanList().stream()
                    .anyMatch(offersPlan -> offersPlan.getId().equals(plan.getId()));
            plan.setActive(isPresent);
        });
        offersDto.setPlanList(planList);
        return offersDto;
    }

    public Status deleteById(Long id) {
        offersRepository.findById(id).ifPresentOrElse(
                state -> {
                    offersRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Offers not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");

    }

    public Status saveOrUpdate(MultipartFile file, OffersDto offersDto) {
        try {
            boolean nameExists = offersRepository.existsByNameIgnoreCaseAndIdNot(offersDto.getName(),
                    offersDto.getId() != null ? offersDto.getId() : -1);

            if (nameExists) {
                return new Status(false, "Offers already exists");
            }

            Offers offers = offersDto.getId() == null ? new Offers(offersDto)
                    : this.setOffers(offersDto);

            if (file != null) {
                if (!(file.isEmpty())) {
                    offers.setImage(this.uploadProfile(file));
                }
            }

            offersRepository.save(offers);
            return new Status(true, offersDto.getId() == null ? "Added Successfully" : "Updated Successfully");
        }

        catch (Exception e) {
            log.error("Error saving or updating offers: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }

    }

    private Offers setOffers(OffersDto offersDto) {
        return offersRepository.findById(offersDto.getId())
                .map(existingOffers -> {
                    existingOffers.setName(offersDto.getName());
                    existingOffers.setCodee(offersDto.getCodee());
                    existingOffers.setDiscount(offersDto.getDiscount());
                    existingOffers.setDiscountType(offersDto.getDiscountType());
                    existingOffers.setStartDate(offersDto.getStartDate());
                    existingOffers.setEndDate(offersDto.getEndDate());
                    existingOffers.setMinOrderAmount(offersDto.getMinOrderAmount());
                    existingOffers.setMaxDiscount(offersDto.getMaxDiscount());
                    existingOffers.setLimitPerUser(offersDto.getLimitPerUser());
                    existingOffers.setDescription(offersDto.getDescription());

                      if (offersDto.getPlanList() != null) {
                Set<Plan> plan = offersDto.getPlanList().stream().map(Plan::new).collect(Collectors.toSet());
                existingOffers.setPlanList(plan);
            }

                    return existingOffers;
                }).orElseThrow(() -> new EntityNotFoundException("offers not found with ID: " + offersDto.getId()));
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

    public Page<OfferProjection> searchByAdmin(Pageable pageable, OffersSearch offersSearch) {

        Long discount = offersSearch.getDiscount() != null ? offersSearch.getDiscount() : null;
        String name = offersSearch.getName() != null ? offersSearch.getName() : null;
        String codee = offersSearch.getCodee() != null ? offersSearch.getCodee() : null;
        String discountType = offersSearch.getDiscountType() != null ? offersSearch.getDiscountType() : null;
        // Date startDate = offersSearch.getStartDate() != null ?
        // offersSearch.getStartDate() : null;
        // Date endDate = offersSearch.getEndDate() != null ? offersSearch.getEndDate()
        // : null;
        Long minOrderAmount = offersSearch.getMinOrderAmount() != null ? offersSearch.getMinOrderAmount() : null;
        Long maxDiscount = offersSearch.getMaxDiscount() != null ? offersSearch.getMaxDiscount() : null;
        Integer limitPerUser = offersSearch.getLimitPerUser() != null ? offersSearch.getLimitPerUser() : null;

        return offersRepository.findAdminByNameAndDiscountTypeByCodeAndTime(pageable, discount, name, codee,
                discountType, minOrderAmount, maxDiscount, limitPerUser);
    }

}
