package com.jee.clinichub.app.core.files;

import org.springframework.web.multipart.MultipartFile;

public interface CDNProviderService {
	
	public String upload(MultipartFile multipartFile, String filePath);
	
	public String upload(byte[] byteFile, String fileName, String filePath);

	public byte[] download(String filePath);
	
	public boolean remove(String fileName);

	String getUrl(String publicId);
	
	String transformFormat(String publicId,String FetchFormat);

	

}
