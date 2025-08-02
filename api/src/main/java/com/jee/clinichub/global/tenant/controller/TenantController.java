package com.jee.clinichub.global.tenant.controller;

import java.net.URL;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantFilter;
import com.jee.clinichub.global.tenant.model.TenantProj;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;
import com.jee.clinichub.global.tenant.model.WebInfo;
import com.jee.clinichub.global.tenant.service.TenantService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/tenants")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    private final JwtService jwtService;

    private final FileService fileService;

    @Value("${app.default-tenant}")
    public String defaultTenant;

    @GetMapping("/filter-tenant")
    public Page<TenantProj> filterAllTenant(Pageable pageable, @RequestBody TenantFilter filter) {
       return tenantService.filterAllTenant(pageable,filter);
    }

    @GetMapping("/list")
    public List<TenantRequestProj> getAllTenantRequests() {
        List<TenantRequestProj> tenantList = tenantService.getAllTenantRequests();
        return tenantList;
    }

    @GetMapping("/approve/{id}")
    public ResponseEntity<Status> approve(@PathVariable Long id, HttpServletRequest request) {
        String subdomain = request.getServerName();
        Status created = tenantService.approve(id, subdomain);
        return ResponseEntity.status(HttpStatus.OK).body(created);
    }

    @PostMapping("/public/request")
    public ResponseEntity<Status> request(@RequestBody TenantRequestDto tenantRequestDto, HttpServletRequest request) {

        String subdomain = request.getServerName();

        Status created = tenantService.request(tenantRequestDto, subdomain);
        return ResponseEntity.status(HttpStatus.OK).body(created);
    }

    @GetMapping("/public/isExistsByTenantId/{clientId}")
    public ResponseEntity<Status> isExistsByTenantId(@PathVariable String clientId, HttpServletRequest request) {

        Status created = tenantService.isExistsByTenantId(clientId);
        return ResponseEntity.status(HttpStatus.OK).body(created);
    }

    @GetMapping(value = "/public/info/{clientId}")
    public ResponseEntity<?> getWebinfo(@PathVariable String clientId) {
        try {
            Tenant tenant = tenantService.findByTenantId(clientId);

            if (tenant == null) {
                // Tenant not found
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String status = tenant.getStatus();

            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new WebInfo("Clinic status is unknown or not set. Please contact support."));
            }

            switch (status) {
                case "ACTIVE":
                    WebInfo wi = new WebInfo();
                    wi.setName(tenant.getClientId());
                    wi.setUrl(tenant.getClientUrl());
                    wi.setTitle(tenant.getTitle());
                    wi.setFavIcon(tenant.getFavIcon());
                    wi.setBannerHome(tenant.getBannerHome());
                    wi.setLogo(tenant.getLogo());
                    return ResponseEntity.ok(wi);

                case "BLOCKED":
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new WebInfo("Your clinic account has been permanently blocked. Please contact support."));

                case "TEMP_BLOCKED":
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new WebInfo("Your clinic account is temporarily blocked. Please try again later or contact support."));

                case "PENDING":
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new WebInfo("Your clinic account is pending approval. Please wait for confirmation."));

                case "SUSPENDED":
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new WebInfo("Your clinic account is suspended. Please contact support for details."));

                default:
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new WebInfo("Your clinic account status is currently inactive or unknown. Please contact support."));
            
            }

        } catch (Exception e) {
            log.error("Error fetching tenant info for clientId {}: {}", clientId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @CacheEvict(value = "tenantCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/config/upload")
    public WebInfo configUpload(
            @RequestPart(value = "logoFile", required = false) MultipartFile logoFile,
            @RequestPart(value = "favFile", required = false) MultipartFile favFile,
            @RequestPart(value = "bannerFile", required = false) MultipartFile bannerFile,
            HttpServletRequest req) {

        WebInfo webInfo = new WebInfo();
        webInfo = tenantService.upload(logoFile, favFile, bannerFile);

        return webInfo;
    }

    @GetMapping(path = "/public/download")
    public ResponseEntity<ByteArrayResource> downloadFile(@RequestParam("fileName") String fileName,
            @RequestParam(name = "type", required = false) String type, HttpServletRequest request) {
        try {

            String origin = request.getHeader("referer");
            // origin = "https://pati.clinichub.in/#/admin/config";

            URL orginUrl = new URL(origin);

            String tenant = orginUrl.getHost().split("\\.")[0];// jwtTokenUtil.getClientId(request);
            tenant = tenant.equalsIgnoreCase("localhost") ? defaultTenant : tenant;

            // if(fileName.trim().isEmpty() || fileName.equalsIgnoreCase("null")) {return
            // ResponseEntity.badRequest().contentLength(0).body(null); }

            final byte[] data = fileService.download(fileName, true, tenant, type);
            final ByteArrayResource resource = new ByteArrayResource(data);
            return ResponseEntity
                    .ok()
                    .contentLength(data.length)
                    .header("Content-type", "application/octet-stream")
                    .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
                    .header("Cache-Control", "no-cache")
                    .body(resource);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().contentLength(0).body(null);
        }
    }

}
