package com.jee.clinichub.app.core.files.awsS3.service;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.jee.clinichub.app.core.files.CDNProviderService;

import lombok.extern.log4j.Log4j2;

//@Service
@Log4j2
public class AmazonS3ServiceImpl implements CDNProviderService {

	@Autowired
	private AmazonS3 amazonS3;

	@Value("${aws.s3.bucket.name}")
	private String bucketName;

	// @Override
	public PutObjectResult upload(String filePath, File file) {
		PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, filePath, file);
		return amazonS3.putObject(putObjectRequest);
	}

	@Override
	public String upload(MultipartFile multipartFile, String fileName) {

		try {

			/*
			 * Map<String, String> metadata = new HashMap<>(); metadata.put("Content-Type",
			 * multipartFile.getContentType()); metadata.put("Content-Length",
			 * String.valueOf(multipartFile.getSize()));
			 */

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(multipartFile.getSize());
			metadata.setContentType(multipartFile.getContentType());

			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName,
					multipartFile.getInputStream(), metadata);
			PutObjectResult p = amazonS3.putObject(putObjectRequest);
			return p.getVersionId();

		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;

	}

	@Override
	public byte[] download(String filePath) {
		try {
			S3Object s3Object = amazonS3.getObject(bucketName, filePath);
			byte[] content;
			final S3ObjectInputStream stream = s3Object.getObjectContent();
			content = IOUtils.toByteArray(stream);
			s3Object.close();
			return content;
		} catch (AmazonS3Exception e) {
			log.error("error [" + e.getMessage() + "] occurred while uploading [" + filePath + "] ");
		} catch (IOException | AmazonClientException ex) {
			log.error("error [" + ex.getMessage() + "] occurred while uploading [" + filePath + "] ");
		}
		return null;
	}

	@Override
	public boolean remove(String fileName) {
		try {
			amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileName));
			return true;
		} catch (AmazonServiceException ex) {
			log.error("error [" + ex.getMessage() + "] occurred while removing [" + fileName + "] ");
		}
		return false;
	}

	@Override
	public String getUrl(String publicId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String transformFormat(String publicId, String FetchFormat) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String upload(byte[] byteFile, String fileName, String filePath) {
		// TODO Auto-generated method stub
		return null;
	}

}
