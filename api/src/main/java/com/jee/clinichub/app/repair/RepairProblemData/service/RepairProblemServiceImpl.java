package com.jee.clinichub.app.repair.RepairProblemData.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;

import com.jee.clinichub.app.core.files.FileService;

import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemData;
import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemDataDto;
import com.jee.clinichub.app.repair.RepairProblemData.repository.RepairProblemRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class RepairProblemServiceImpl implements RepairProblemService{
	    @Autowired private RepairProblemRepository repairProblemRepository;
	
	    @Autowired TypeConverter typeConverter;
	    
	    @Autowired TemplateEngine htmlTemplateEngine;
	    
	    @Autowired FileService fileService;
	    @Autowired TenantService tenantService;

	@Override
	public List<RepairProblemDataDto> getAllRepairProblemData() {
		List<RepairProblemData> repairProblemDataList = repairProblemRepository.findAll();
    	List<RepairProblemDataDto> RepairProblemDataDtoList = repairProblemDataList.stream().map(RepairProblemDataDto::new).collect(Collectors.toList());
  		return RepairProblemDataDtoList;
	}

	@Override
	public RepairProblemDataDto getById(Long id) {
		RepairProblemDataDto repairProblemDataDto = new RepairProblemDataDto();
		try{
			Optional<RepairProblemData> repairProblemData = repairProblemRepository.findById(id);
			if(repairProblemData.isPresent()){
				repairProblemDataDto = new RepairProblemDataDto(repairProblemData.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return repairProblemDataDto;
	}

	@Override
	public Status saveOrUpdate(@Valid RepairProblemDataDto repairProblemDataDto) {
		try {
			RepairProblemData repairProblemData = new RepairProblemData();
			if(repairProblemDataDto.getId()==null ) {
				
				repairProblemData = new RepairProblemData(repairProblemDataDto);
				
				
			}else{
				repairProblemData = this.setRepairProblemData(repairProblemDataDto);
			}
			repairProblemData = repairProblemRepository.save(repairProblemData);
			return new Status(true,( (repairProblemDataDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
			
		}
		catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	private RepairProblemData setRepairProblemData(@Valid RepairProblemDataDto repairProblemDataDto) {
		ObjectMapper mapper = new ObjectMapper();
		RepairProblemData exRepairProblemData = repairProblemRepository.findById(repairProblemDataDto.getId()).get();
		try {
			exRepairProblemData.setType(repairProblemDataDto.getType());
			
			exRepairProblemData.setName(mapper.writeValueAsString(repairProblemDataDto.getName()));
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return exRepairProblemData;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<RepairProblemData> repairProblemData = repairProblemRepository.findById(id);
			if(!repairProblemData.isPresent()){
				return new Status(false,"RepairProblemData Not Found");
			}
			
			repairProblemRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public byte[] repairProblemDataPrint(MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile,
			Long id) {
		try {
			RepairProblemDataDto repairProblemDataDto = getById(id);
    		String html = generateRepairProblemDataHtml(repairProblemDataDto,canvasChartLeftFile,canvasChartRightFile);
    		
    		File tempFile = File.createTempFile("repairProblemData", ".pdf");
    		FileOutputStream fos = new FileOutputStream(tempFile);
    		
    		ConverterProperties converterProperties = new ConverterProperties();
    		//converterProperties.setBaseUri(getBaseUri());
			HtmlConverter.convertToPdf(html,fos,converterProperties);
			
			byte[] pdfBytes = typeConverter.fileToByteArray(new File( tempFile.getPath()));
			return pdfBytes;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        log.info( "PDF Created! Successfully" );
		return null;
	}
	
	private String generateRepairProblemDataHtml(RepairProblemDataDto repairProblemDataDto, MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile) {
		try {
			
			 byte[] imageLeftByte = Base64.encodeBase64(canvasChartLeftFile.getBytes());
		     String imageLeftDataBase64 = new String(imageLeftByte);
		     
		     byte[] imageRightByte = Base64.encodeBase64(canvasChartRightFile.getBytes());
		     String imageRightDataBase64 = new String(imageRightByte);
			
			final Context ctx = new Context(LocaleContextHolder.getLocale());
			
			String tenantId = TenantContextHolder.getCurrentTenant();
			Tenant tenant = tenantService.findByTenantId(tenantId);
			String tenantLogoUrl = fileService.getSecureUrl(tenant.getLogo(), true, tenantId);
			
			String host = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
			//ctx.setVariable("cssurl", host+"/css/patient/audiogram/style.css");
		    ctx.setVariable("clinicForm", "RepairProblemData Report");
		    ctx.setVariable("clinicName", tenant.getTitle());
		    ctx.setVariable("clinicLogo", tenantLogoUrl);
		    
		    ctx.setVariable("data", repairProblemDataDto);
		    ctx.setVariable("imageLeft", imageLeftDataBase64);
		    ctx.setVariable("imageRight", imageRightDataBase64);
		    
			 
			final String htmlContent = this.htmlTemplateEngine.process("repair/repairproblemdata/repairproblemdata.html", ctx);
		    return htmlContent;
			    
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		return null;
	    
	    
	} 

}
