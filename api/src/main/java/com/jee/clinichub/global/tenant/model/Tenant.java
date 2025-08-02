package com.jee.clinichub.global.tenant.model;

import com.jee.clinichub.config.TenantIdentifierResolver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="tenant",schema = TenantIdentifierResolver.DEFAULT_TENANT)
public class Tenant{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 10)
    @Column(name = "status",nullable = false)
    private String status;
    
    @Column(name = "client_id",nullable = false,unique = true)
    private String clientId;
    
    @Column(name = "client_url",nullable = false)
    private String clientUrl;
    
    @Column(name = "title",nullable = false)
    private String title;
    
    @Column(name = "favicon",nullable = false)
    private String favIcon;

    @Column(name = "schema_name",nullable = false)
    private String schemaName;
    
    @Column(name = "banner_home",nullable = false)
    private String bannerHome;
    
    @Column(name = "logo",nullable = false)
    private String logo;
    

	public Tenant(TenantDto tenantDto) {
        this.id = tenantDto.getId();
        this.status=tenantDto.getStatus();
        this.clientId = tenantDto.getClientId();
        this.clientUrl=tenantDto.getClientUrl();
        this.title = tenantDto.getTitle();
        this.favIcon = tenantDto.getFavIcon();
        this.bannerHome = tenantDto.getBannerHome();
        this.logo = tenantDto.getLogo();
        this.schemaName = tenantDto.getSchemaName();
    
	}

   
	
}
