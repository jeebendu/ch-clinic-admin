package com.jee.clinichub.app.core.dns.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jee.clinichub.app.core.dns.model.Dns;
import com.jee.clinichub.app.core.dns.model.DnsListResponse;
import com.jee.clinichub.app.core.dns.model.DnsResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class CloudflareDnsService implements DnsService{

   @Value("${cloudflare.host}")
	private String hostCloudflare;

	@Value("${cloudflare.zone-id}")
	private String zoneId;

	@Value("${cloudflare.domain}")
	private String domain;

	@Value("${cloudflare.token}")
	private String token;

	@Qualifier("myRestTemplate")
	private final RestTemplate restTemplate;

    @Override
    public boolean createDns(String clientId) {
        try {
            Dns dns = new Dns();
            dns.setName(clientId + "." + domain);
            dns.setContent(domain);
            dns.setProxied(true);
            dns.setType("CNAME");
            dns.setComment(clientId + " Domain verification record added by API.");
            dns.setTtl(1);

            HttpHeaders headers = createHeaders();
            HttpEntity<Dns> request = new HttpEntity<>(dns, headers);

            String url =  "/zones/" + zoneId + "/dns_records";

            ResponseEntity<DnsResponse> response = restTemplate.postForEntity(url, request, DnsResponse.class);

            if (response.getBody() != null && response.getBody().isSuccess()) {
                log.info("DNS created: {}", response.getBody().getResult());
                return true;
            } else {
                log.error("Failed to create DNS: {}", response.getBody());
            }
        } catch (Exception e) {
            log.error("Exception during DNS creation", e);
        }
        return false;
    }

    @Override
    public boolean deleteDns(String clientId) {
        try {
            String dnsName = clientId + "." + domain;
            String listUrl =  "/zones/" + zoneId + "/dns_records?name=" + dnsName;

            HttpEntity<Void> requestEntity = new HttpEntity<>(createHeaders());
            ResponseEntity<DnsListResponse> listResponse = restTemplate.exchange(
                    listUrl, HttpMethod.GET, requestEntity, DnsListResponse.class);

            if (listResponse.getBody() != null && listResponse.getBody().isSuccess() &&
                !listResponse.getBody().getResult().isEmpty()) {

                String recordId = listResponse.getBody().getResult().get(0).getId();
                String deleteUrl =  "/zones/" + zoneId + "/dns_records/" + recordId;

                ResponseEntity<DnsResponse> deleteResponse = restTemplate.exchange(
                        deleteUrl, HttpMethod.DELETE, requestEntity, DnsResponse.class);

                if (deleteResponse.getBody() != null && deleteResponse.getBody().isSuccess()) {
                    log.info("DNS deleted for client: {}", clientId);
                    return true;
                } else {
                    log.error("DNS deletion failed: {}", deleteResponse.getBody());
                }
            } else {
                log.warn("No DNS record found for: {}", dnsName);
            }
        } catch (Exception e) {
            log.error("Exception during DNS deletion", e);
        }
        return false;
    }

    @Override
    public boolean doesDnsRecordExist(String subdomain) {
		try {
			String url = String.format("/zones/%s/dns_records?name=%s.%s", zoneId, subdomain, domain);
			// Cloudflare returns a list of DNS records in the "result" field
			DnsResponse response = restTemplate.getForObject(url, DnsResponse.class);
			if (response != null && response.isSuccess() && response.getResult() != null) {
				// If result is not empty, record exists
				return true;
			}
		} catch (Exception e) {
			log.error("Error checking DNS record existence for {}.{}: {}", subdomain, domain, e.getMessage());
		}
		return false;
	}

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
