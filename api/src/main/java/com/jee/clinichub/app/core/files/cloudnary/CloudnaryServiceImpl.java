package com.jee.clinichub.app.core.files.cloudnary;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.Url;
import com.cloudinary.utils.ObjectUtils;
import com.jee.clinichub.app.core.files.CDNProviderService;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class CloudnaryServiceImpl implements CDNProviderService{
	
	@Autowired
	private Cloudinary cloudinary;

	@Override
	public String upload(MultipartFile multipartFile, String filePath) {
		try {
			//cloudinary.uploader().upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",ObjectUtils.asMap("public_id", "olympic_flag"));

			String extension = FilenameUtils.getExtension(multipartFile.getOriginalFilename());
			filePath = filePath.replace("."+extension, "");
			Map uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.asMap("public_id", filePath));
			String pathUrl = uploadResult.get("secure_url").toString();
			log.info(pathUrl);
			return pathUrl;
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e);
			e.printStackTrace();
		}
		return null;
	}
	
	@Override
	public String upload(byte[] byteFile,String fileName, String filePath) {
		try {
			//cloudinary.uploader().upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",ObjectUtils.asMap("public_id", "olympic_flag"));

			String extension = FilenameUtils.getExtension(fileName);
			filePath = filePath.replace("."+extension, "");
			Map uploadResult = cloudinary.uploader().upload(byteFile, ObjectUtils.asMap("public_id", filePath));
			String pathUrl = uploadResult.get("secure_url").toString();
			log.info(pathUrl);
			return pathUrl;
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e);
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public byte[] download(String publicId) {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		String url = getUrl(publicId);
	    try {
	        byte[] chunk = new byte[4096];
	        int bytesRead;
	        InputStream stream = new URL(url).openStream();

	        while ((bytesRead = stream.read(chunk)) > 0) {
	            outputStream.write(chunk, 0, bytesRead);
	        }

	    } catch (IOException e) {
	        e.printStackTrace();
	        return null;
	    }

	    return outputStream.toByteArray();
	}
	
	@Override
	public String getUrl(String publicId) {
	
		String url = cloudinary.url().generate(publicId);
	    return url;
	}

	@Override
	public boolean remove(String fileName) {
		return false;
		// TODO Auto-generated method stub
		
	}

	@Override
	public String transformFormat(String publicId, String FetchFormat) {
		
		String imageUrl = getUrl(publicId);
		
		// Create a transformation to convert the image to JPG
        Transformation transformation = new Transformation().fetchFormat(FetchFormat);

        // Generate the URL of the converted image
        String convertedImageUrl = cloudinary.url().transformation(transformation).generate();
		return imageUrl;
	}

	
	
   

	
}


