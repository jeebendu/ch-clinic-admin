package com.jee.clinichub.app.core.files;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.model.AmazonS3Exception;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class FileServiceImpl implements FileService{
	
    @Autowired
    private CDNProviderService cdnProviderService;

	@Value("${upload.root.folder}")
	private String TENANT_ROOT;
	
    public final String FS = "/";
 
    @Async
    public String upload(MultipartFile multipartFile, boolean enablePublicReadAccess,String tenantId){
    	
    	 if (multipartFile.isEmpty())
             throw new IllegalStateException("Cannot upload empty file");

         String tenantPath = TENANT_ROOT+FS+tenantId;
         String isPublicOrPrivate = enablePublicReadAccess?"public":"private";
         String fileName = String.format("%s", multipartFile.getOriginalFilename());
         
         String filePath = tenantPath +FS+ isPublicOrPrivate +FS+ fileName;
         log.info("File name "+ filePath);
        

        try {
        	//File file = convertMultiPartToFile(multipartFile);
        	// Uploading file to s3
        	//PutObjectResult putObjectResult = amazonS3Service.upload(filePath, file);
            String filename = cdnProviderService.upload( multipartFile,filePath );
        	
            return fileName;
            
        } catch (AmazonServiceException ex) {
            log.error("error [" + ex.getMessage() + "] occurred while uploading [" + fileName + "] ");
        }
		return null;
    }
    
    private File convertMultiPartToFile(MultipartFile file ) throws IOException {
        File convFile = new File( file.getOriginalFilename() );
        FileOutputStream fos = new FileOutputStream( convFile );
        fos.write( file.getBytes() );
        fos.close();
        return convFile;
    }

    @Async
    public void remove(String filePath)
    {
        try {
        	cdnProviderService.remove(filePath);
        } catch (AmazonServiceException ex) {
            log.error("error [" + ex.getMessage() + "] occurred while removing [" + filePath + "] ");
        }
    }

    /**
     * Download a file from s3 bucket
     *
     * @param keyName keyName
     * @return byte[]
     */
    public byte[] download(final String fileName, boolean enablePublicReadAccess,String tenantId, String type) {
    	String filePath = null;
        try {
        	
        	filePath = getPath(fileName,enablePublicReadAccess,tenantId);
            if((fileName.trim().isEmpty() || fileName.equalsIgnoreCase("null")) && (!type.trim().isEmpty() && !type.equalsIgnoreCase("null"))) {
            	String root = TENANT_ROOT+FS+"default/placeholder/";
            	if(type.equalsIgnoreCase("logo")) {filePath = root + "logo.png";}
            	else if(type.equalsIgnoreCase("favicon")) {filePath = root + "favicon.ico";}
            	else if(type.equalsIgnoreCase("banner")) {filePath = root + "banner.jpg";}
            }
            
            byte[] content  = cdnProviderService.download(filePath);
            return content;
        } catch (AmazonS3Exception e) {
        	log.error("error [" + e.getMessage() + "] occurred while uploading [" + filePath + "] ");
        } catch (AmazonClientException ex) {
        	log.error("error [" + ex.getMessage() + "] occurred while uploading [" + filePath + "] ");
        }
		return null;
    }

	@Override
	public String transformFormat(String fileName,boolean enablePublicReadAccess,String tenantId, String FetchFormat) {
		String filePath = getPath(fileName,enablePublicReadAccess,tenantId);
		return cdnProviderService.transformFormat(filePath,FetchFormat);
	}

	private String getPath( String fileName, boolean enablePublicReadAccess,String tenantId) {
		String tenantPath = TENANT_ROOT+FS+tenantId;
    	String isPublicOrPrivate = enablePublicReadAccess?"public":"private";
    	String filePath = tenantPath +FS+ isPublicOrPrivate +FS+ fileName;
        //log.info("File name "+ filePath);
		return filePath;
	}

	@Override
	public String getSecureUrl(String fileName, boolean enablePublicReadAccess, String tenantId) {
		String filePath = getPath(fileName,enablePublicReadAccess,tenantId);
		return cdnProviderService.getUrl(filePath);
	}
	


	

}