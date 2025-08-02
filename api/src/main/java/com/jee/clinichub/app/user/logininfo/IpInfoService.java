package com.jee.clinichub.app.user.logininfo;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class IpInfoService {

    private static final String IPINFO_URL = "http://ip-api.com/json/%s?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,query";

    public IpInfo getIpLocation(String ipAddress) {

        if (ipAddress == null || !isValidIp(ipAddress) || ipAddress.equals("0:0:0:0:0:0:0:1")) {
            log.warn("Invalid IP address" + ipAddress);
            return null;
        }
        
        String url = String.format(IPINFO_URL, ipAddress);
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response);
            if ("success".equals(jsonNode.get("status").asText())) {
                return IpInfo.builder()
                        .country(jsonNode.get("country").asText())
                        .countryCode(jsonNode.get("countryCode").asText())
                        .region(jsonNode.get("regionName").asText())
                        .city(jsonNode.get("city").asText())
                        .isp(jsonNode.get("isp").asText())
                        .lat(jsonNode.get("lat").asDouble())
                        .lon(jsonNode.get("lon").asDouble())
                        .mobile(jsonNode.get("mobile").asBoolean())
                        .build();
            } else {
                log.warn("Failed to retrieve IP location");
            }
        } catch (Exception e) {
            log.warn("Error parsing IP location response", e);
        }
        return null;
    }

    private boolean isValidIp(String ipAddress) {
        try {
            InetAddress.getByName(ipAddress);
            return true;
        } catch (UnknownHostException e) {
            return false;
        }
    }
    
}