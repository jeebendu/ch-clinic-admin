package com.jee.clinichub.app.core.files;

import java.net.URL;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.global.security.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("v1/files")
public class FilesController {
	
	 @Autowired
	 private  JwtService jwtService;
	
    @Autowired
    private  FileService fileService;
    
    @Value("${jwt.header.string}")
    public String HEADER_STRING;

    @Value("${jwt.token.prefix}")
    public String TOKEN_PREFIX;

    @Value("${app.default-tenant}")
    public String defaultTenant;


    @PostMapping("/upload")
    public String upload(@RequestPart(value = "file") MultipartFile file,HttpServletRequest req) {
        String tenant = jwtService.getTenantId(req);
       return fileService.upload(file, true,tenant);
    }
    
   
   

	@PostMapping("/remove")
    public void remove(@RequestParam("file_name") String fileName) {
    	fileService.remove(fileName);
    }
	
    /**
     * Download the file
     *
     * @param fileName fileName
     * @return ByteArrayResource
     */
    @GetMapping(path = "/download")
    public ResponseEntity<ByteArrayResource> downloadFile(@RequestParam("fileName") final String fileName,HttpServletRequest request) {
        try {
        	
        	String origin = request.getHeader("referer");
        	//origin = "https://pati.clinichub.in/#/admin/config";
        	
        	URL orginUrl=new URL(origin);  
        
        	String tenant = orginUrl.getHost().split("\\.")[0];//jwtTokenUtil.getClientId(request);
        	tenant = tenant.equalsIgnoreCase("localhost")?defaultTenant:tenant;
        	
        	if(fileName.trim().isEmpty() || fileName.equalsIgnoreCase("null")) {return ResponseEntity.badRequest().contentLength(0).body(null); }
        	
            final byte[] data = fileService.download(fileName,true,tenant, null);
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
