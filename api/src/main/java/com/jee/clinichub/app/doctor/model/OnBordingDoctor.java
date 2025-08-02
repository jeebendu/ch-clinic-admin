package com.jee.clinichub.app.doctor.model;

import java.util.List;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;

import lombok.Data;

@Data
public class OnBordingDoctor extends DoctorDto {

  private List<Clinic> clinicList;
  private TenantRequestDto tenantRequest;
    
}
