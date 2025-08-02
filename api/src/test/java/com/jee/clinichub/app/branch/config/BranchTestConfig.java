
package com.jee.clinichub.app.branch.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.branch.service.BranchSyncService;
import com.jee.clinichub.app.branch.service.BranchValidationService;

@TestConfiguration
@Profile("default")
public class BranchTestConfig {

    @Bean
    @Primary
    public BranchRepository mockBranchRepository() {
        return Mockito.mock(BranchRepository.class);
    }

    @Bean
    @Primary
    public BranchSyncService mockBranchSyncService() {
        return Mockito.mock(BranchSyncService.class);
    }

    @Bean
    @Primary
    public BranchValidationService mockBranchValidationService() {
        return Mockito.mock(BranchValidationService.class);
    }

    @Bean
    @Primary
    public ClinicRepository mockClinicRepository() {
        return Mockito.mock(ClinicRepository.class);
    }
}
