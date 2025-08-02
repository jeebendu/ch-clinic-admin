package com.jee.clinichub.app.core.files;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
	
	public String upload(MultipartFile multipartFile, boolean enablePublicReadAccess, String tenant);

	public byte[] download(String fileName, boolean enablePublicReadAccess, String rootFolder, String type);
	
	public void remove(String fileName);
	
	String transformFormat(String fileName, boolean enablePublicReadAccess, String tenantId, String FetchFormat);
	
	public String getSecureUrl(String fileName, boolean enablePublicReadAccess, String rootFolder);

}
