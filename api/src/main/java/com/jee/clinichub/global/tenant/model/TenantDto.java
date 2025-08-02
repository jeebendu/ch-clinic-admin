package com.jee.clinichub.global.tenant.model;

import com.jee.clinichub.app.user.model.UserDto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TenantDto {

  private Long id;

  private String status;

  private String clientId;

  private String clientUrl;

  private String title;

  private String favIcon;

  private String bannerHome;

  private String logo;
  private String schemaName;

  public TenantDto(Tenant tenant) {
    this.id = tenant.getId();
    this.status=tenant.getStatus();
    this.clientId = tenant.getClientId();
    this.clientUrl=tenant.getClientUrl();
    this.title = tenant.getTitle();
    this.favIcon = tenant.getFavIcon();
    this.bannerHome = tenant.getBannerHome();
    this.logo = tenant.getLogo();
    this.schemaName = tenant.getSchemaName();

  }

}
