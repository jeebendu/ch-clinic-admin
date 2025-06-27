
package com.clinichub.controller;

import com.clinichub.service.ZohoVaultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    @Autowired
    private ZohoVaultService vaultService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("vault", vaultService.isVaultHealthy() ? "UP" : "DOWN");
        
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/vault")
    public ResponseEntity<Map<String, String>> vaultHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", vaultService.isVaultHealthy() ? "UP" : "DOWN");
        
        return ResponseEntity.ok(status);
    }
}
