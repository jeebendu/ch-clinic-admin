package com.jee.clinichub.app.core.files.cloudnary;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudnaryConfig{
	
    @Value("${cloudnary.api.key}")
    private String apiKey;

    @Value("${cloudnary.api.secret}")
    private String apiSecret;

    @Value("${cloudnary.cloud_name}")
    private String cloudName;

    @Bean(name="config")
    public Cloudinary cloudnaryConfig() {
    	Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
    	  "cloud_name", cloudName,
    	  "api_key", apiKey,
    	  "api_secret", apiSecret));
        return cloudinary;
    }
}