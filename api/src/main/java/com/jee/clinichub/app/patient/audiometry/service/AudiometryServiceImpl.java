package com.jee.clinichub.app.patient.audiometry.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Date;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.patient.audiometry.model.Audiometry;
import com.jee.clinichub.app.patient.audiometry.model.AudiometryDto;
import com.jee.clinichub.app.patient.audiometry.repository.AudiometryRepository;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;
import com.jee.clinichub.app.patient.schedule.service.ScheduleService;
import com.jee.clinichub.global.context.TimeZoneContextHolder;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.service.TenantService;
import com.jee.clinichub.global.utility.DateUtility;
import com.jee.clinichub.global.utility.TypeConverter;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "audiometryService")
public class AudiometryServiceImpl implements AudiometryService {
	
    @Autowired
    private AudiometryRepository audiometryRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired TypeConverter typeConverter;
    
    @Autowired TemplateEngine htmlTemplateEngine;
    
    @Autowired TenantService tenantService;
    
    @Autowired FileService fileService;
    
    @Autowired ScheduleService scheduleService;
    
    @Autowired
    private Environment environment;
    
    @Autowired
    private SequenceService sequenceService;
    
    @Autowired
    ModuleRepository moduleRepository;
    
	@Override
	public Status saveOrUpdate(AudiometryDto audiometryDto) {
		try{
			
			Module module = moduleRepository.findByName(ModuleEnum.audiogram.toString());
			if(module==null){
				return new Status(false,"1005 : Contact Admin for Sequense");
			}
			
			Audiometry audiometry = new Audiometry();
			String nextSequense = null;
			if(audiometryDto.getId()==null || audiometryDto.getId()==0) {
				Branch branch = BranchContextHolder.getCurrentBranch();
				audiometry = new Audiometry(audiometryDto);
				audiometry.setBranch(branch);
				nextSequense = sequenceService.getNextSequense(audiometry.getBranch().getId(),module.getId());
				audiometry.setUid(nextSequense);
			}else{
				audiometry = this.setAudiometry(audiometryDto);
			}
			
			Optional<Patient> patient = patientRepository.findById(audiometryDto.getPatient().getId());
			if(patient.isPresent()){
				audiometry.setPatient(patient.get());
			}
			
			
			
			audiometry = audiometryRepository.save(audiometry);
			if(audiometryDto.getId()==null || audiometryDto.getId()==0) {
				boolean status = sequenceService.incrementSequense(audiometry.getBranch().getId(),module.getId(),nextSequense);
			}
			
			return new Status(audiometry.getId(),true,( (audiometryDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
	
	
    private Audiometry setAudiometry(AudiometryDto audiometryDto) {
    	ObjectMapper mapper = new ObjectMapper();
    	Audiometry exAudiometry = audiometryRepository.findById(audiometryDto.getId()).get();
    	try {
			exAudiometry.setPuretoneLeft(mapper.writeValueAsString(audiometryDto.getPuretoneLeft()));
			exAudiometry.setPuretoneRight(mapper.writeValueAsString(audiometryDto.getPuretoneRight()));
			exAudiometry.setEarLeft(mapper.writeValueAsString(audiometryDto.getEarLeft()));
			exAudiometry.setEarRight(mapper.writeValueAsString(audiometryDto.getEarRight()));
			exAudiometry.setTestLeft(mapper.writeValueAsString(audiometryDto.getTestLeft()));
			exAudiometry.setTestRight(mapper.writeValueAsString(audiometryDto.getTestRight()));
			exAudiometry.setImpedanceAudiometry(audiometryDto.getImpedanceAudiometry());
			exAudiometry.setProDiagnosisLeft(audiometryDto.getProDiagnosisLeft());
			exAudiometry.setProDiagnosisRight(audiometryDto.getProDiagnosisRight());
			exAudiometry.setRecommendation(audiometryDto.getRecommendation());
			exAudiometry.setModality(mapper.writeValueAsString(audiometryDto.getModality()));
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return exAudiometry;
		
	}

	@Override
  	public List<AudiometryDto> getAllAudiometrys() {
    	List<Audiometry> audiometryList = audiometryRepository.findAllByOrderByIdDesc();
    	List<AudiometryDto> audiometryDtoList = audiometryList.stream().map(AudiometryDto::new).collect(Collectors.toList());
  		return audiometryDtoList;
  	}

   
    
	@Override
	//@Cacheable(value = "audiometryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public AudiometryDto getById(Long id) {
		AudiometryDto audiometryDto = new AudiometryDto();
		try{
			Optional<Audiometry> audiometry = audiometryRepository.findById(id);
			if(audiometry.isPresent()){
				audiometryDto = new AudiometryDto(audiometry.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return audiometryDto;
	}
	
	@Override
	//@Cacheable(value = "audiometryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public List<AudiometryDto> getByPatientId(Long patientId) {
		List<Audiometry> audiometryList = audiometryRepository.findAllByPatient_id(patientId);
    	List<AudiometryDto> audiometryDtoList = audiometryList.stream().map(AudiometryDto::new).collect(Collectors.toList());
  		return audiometryDtoList;
	}
	
	
	@Override
	@Cacheable(value = "audiometryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public Audiometry getAudiometryById(Long id) {
		Audiometry audiometry = new Audiometry();
		try{
			Optional<Audiometry> _audiometry = audiometryRepository.findById(id);
			if(_audiometry.isPresent()){
				audiometry = _audiometry.get();
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return audiometry;
	}
	
	

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Audiometry> audiometry = audiometryRepository.findById(id);
			if(!audiometry.isPresent()){
				return new Status(false,"Audiometry Not Found");
			}
			
			audiometryRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public byte[] audiogramPrint(MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile,Long id) {
		// HTML file to PDF
    	try {
    		AudiometryDto audiometryDto = getById(id);
    		PatientDto patientDto = audiometryDto.getPatient();
    		List<ScheduleDto> scheduleDtoList = scheduleService.getAllSchedulesByPID(audiometryDto.getPatient().getId());
			if (scheduleDtoList.size() > 0) {
				ScheduleDto scheduleDto = scheduleDtoList.get(0);
				patientDto.setComplaints(scheduleDto.getComplaints());
				patientDto.setHistoryOf(scheduleDto.getHistoryOf());
				audiometryDto.setPatient(patientDto);
			}
    		if(audiometryDto.getRecommendation()!=null) audiometryDto.setRecommendation(" * "+audiometryDto.getRecommendation().replace("\n", "<br> * "));
    		
			//String convertedDate = DateUtility.convertToTargetTimeZone(audiometryDto.getCreatedTime());
			//audiometryDto.setCreatedTime(convertedDate);

    		String html = generateAudiometryHtml(audiometryDto,canvasChartLeftFile,canvasChartRightFile);
    		File tempFile = File.createTempFile("audiogram", ".pdf");
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
	
	
	



	private String generateAudiometryHtml(AudiometryDto audiometryDto, MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile) {
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
			ctx.setVariable("cssurl", host+"/css/patient/audiogram/style.css");
		    ctx.setVariable("clinicForm", "Audiogram Report");
		    ctx.setVariable("clinicName", tenant.getTitle());
		    ctx.setVariable("clinicLogo", tenantLogoUrl);
		    
		    ctx.setVariable("data", audiometryDto);
		    
		    ctx.setVariable("imageLeft", imageLeftDataBase64);
		    ctx.setVariable("imageRight", imageRightDataBase64);
		    
			 
			final String htmlContent = this.htmlTemplateEngine.process("patient/audiogram/audiogram.html", ctx);
		    return htmlContent;
			    
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		return null;
	    
	    
	} 

	

	
}
