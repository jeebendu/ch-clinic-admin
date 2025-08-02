package com.jee.clinichub.app.core.amazon;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.textract.TextractClient;

@Configuration
public class AmazonTextractClientConfig {

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.access.key.id}")
    private String accessKey;

    @Value("${aws.access.secret}")
    private String secretKey;

    @Bean
    public TextractClient textractClient() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

        return TextractClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}