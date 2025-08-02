package com.jee.clinichub.app.core.slider.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.core.files.FileServiceImpl;
import com.jee.clinichub.app.core.slider.model.Slider;
import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.core.slider.model.SliderProj;
import com.jee.clinichub.app.core.slider.model.SliderSearch;
import com.jee.clinichub.app.core.slider.repository.SliderRepository;
import com.jee.clinichub.global.model.Status;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class SliderServiceImpl implements SliderService {

  
    private final SliderRepository sliderRepository;

   
   private final  CDNProviderService cdnProviderService;


    @Value("${upload.root.folder}")
    private String TENANT_ROOT;

    public final String FS = "/";


    @Override
    // @Async
    public Status upload(MultipartFile multiSlider, boolean b, String tenant,SliderDto sliderObj) {

            String isFile = StringUtils.cleanPath(multiSlider.getOriginalFilename());
            if (isFile.contains("..")) {
                throw new IllegalStateException("Cannot upload empty file");
            }

        String tenantPath = TENANT_ROOT + FS + tenant;
        String isPublicOrPrivate = b ? "public" : "private";
        String sliderName = String.format("%s", multiSlider.getOriginalFilename());
        String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;
       
        try {
            String filename = cdnProviderService.upload(multiSlider, sliderPath);

            sliderObj.setUrl(filename);
          return  this.saveOrUpdate(sliderObj);
            
        } catch (Exception ex) {
            log.error("Error occurred while uploading: " + ex.getMessage());
            return new Status(false,"something went wrong");
        }

     } 

   

    @Override
    public List<SliderDto> getAllSlider() {
        return sliderRepository.findAll().stream().map(SliderDto::new).toList();
    }

    @Override
    public SliderDto getById(Long id) {
       SliderDto sliderDto = new SliderDto();
		try {
			Optional<Slider> slider = sliderRepository.findById(id);
			if (slider.isPresent()) {
				sliderDto = new SliderDto(slider.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return sliderDto;
    }

   

    @Override
    public Status deleteById(Long id) {
        try {
			Optional<Slider> slider = sliderRepository.findById(id);
			if (!slider.isPresent()) {
				return new Status(false, "Slider Not Found");
			}

			sliderRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
    }

    @Override
    public Status saveOrUpdate(@Valid SliderDto sliderDto) {
        try {
            boolean orderExists = sliderRepository.existsBySortOrderAndIdNot(sliderDto.getSortOrder(),
            sliderDto.getId() != null ? sliderDto.getId() : -1);

            if(orderExists){
                return new Status(false, "Sort Order already exists");
            }
			Slider slider = sliderDto.getId() == null ? new Slider(sliderDto) : this.setSlider(sliderDto);
			slider = sliderRepository.save(slider);
			return new Status(true, ((sliderDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

    }

    private Slider setSlider(SliderDto sliderDto) {
        Slider exSlider = sliderRepository.findById(sliderDto.getId()).get();
		exSlider.setName(sliderDto.getName());
        exSlider.setUrl(sliderDto.getUrl());
        exSlider.setDescription(sliderDto.getDescription());
        exSlider.setActive(sliderDto.isActive());
        exSlider.setSortOrder(sliderDto.getSortOrder());
        return exSlider;

    }

    @Override
    public Page<SliderProj> filter(SliderSearch filter, int pageNo, int pageSize) {
        Pageable pr = PageRequest.of(pageNo, pageSize);
		return sliderRepository.findAllByActive(pr,filter.isStatus()
        );
    }


	@Override
    public List<SliderDto> getAllActiveSlider() {
        return sliderRepository.findAllByActive(true);
    }

}




    

