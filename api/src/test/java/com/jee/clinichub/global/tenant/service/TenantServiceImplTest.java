
package com.jee.clinichub.global.tenant.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantDto;
import com.jee.clinichub.global.tenant.model.TenantFilter;
import com.jee.clinichub.global.tenant.model.TenantProj;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;
import com.jee.clinichub.global.tenant.model.WebInfo;
import com.jee.clinichub.global.tenant.repository.TenantRepository;
import com.jee.clinichub.global.tenant.repository.TenantRequestRepository;

@Disabled
@ExtendWith(MockitoExtension.class)
class TenantServiceImplTest {

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private TenantRequestRepository tenantRequestRepository;

    @InjectMocks
    private TenantServiceImpl tenantService;

    private Tenant testTenant;
    private TenantDto testTenantDto;
    private TenantRequest testTenantRequest;
    private TenantRequestDto testTenantRequestDto;
    private TenantFilter testTenantFilter;

    @BeforeEach
    void setUp() {
        testTenant = new Tenant();
        testTenant.setId(1L);
        testTenant.setClientId("test-clinic");
        testTenant.setClientUrl("testclinic.clinichub.care");
        testTenant.setTitle("Test Clinic");
        testTenant.setSchemaName("test_clinic_schema");
        testTenant.setStatus("ACTIVE");
        testTenant.setLogo("test-logo.png");
        testTenant.setFavIcon("test-favicon.ico");
        testTenant.setBannerHome("test-banner.jpg");

        testTenantDto = new TenantDto();
        testTenantDto.setId(1L);
        testTenantDto.setClientId("test-clinic");
        testTenantDto.setClientUrl("testclinic.clinichub.care");
        testTenantDto.setTitle("Test Clinic");
        testTenantDto.setSchemaName("test_clinic_schema");
        testTenantDto.setStatus("ACTIVE");

        testTenantRequest = new TenantRequest();
        testTenantRequest.setId(1L);
        testTenantRequest.setName("Test Clinic Request");
        testTenantRequest.setEmail("test@testclinic.com");
        testTenantRequest.setStatus("PENDING");

        testTenantRequestDto = new TenantRequestDto();
        testTenantRequestDto.setName("Test Clinic Request");
        testTenantRequestDto.setEmail("test@testclinic.com");

        testTenantFilter = new TenantFilter();
        testTenantFilter.setSearchKey("test");
    }

    @Test
    void testCreateUser() {
        // Given
        when(tenantRepository.existsByClientId("test-clinic")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(testTenant);

        // When
        Status result = tenantService.createUser(testTenantDto);

        // Then
        assertTrue(result.isStatus());
        assertEquals("Tenant created successfully", result.getMessage());
        verify(tenantRepository, times(1)).existsByClientId("test-clinic");
        verify(tenantRepository, times(1)).save(any(Tenant.class));
    }

    @Test
    void testCreateUserAlreadyExists() {
        // Given
        when(tenantRepository.existsByClientId("test-clinic")).thenReturn(true);

        // When
        Status result = tenantService.createUser(testTenantDto);

        // Then
        assertFalse(result.isStatus());
        assertEquals("Tenant with clientId already exists", result.getMessage());
        verify(tenantRepository, times(1)).existsByClientId("test-clinic");
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testFindByTenantId() {
        // Given
        when(tenantRepository.findByClientId("test-clinic")).thenReturn(Optional.of(testTenant));

        // When
        Tenant result = tenantService.findByTenantId("test-clinic");

        // Then
        assertNotNull(result);
        assertEquals("test-clinic", result.getClientId());
        assertEquals("Test Clinic", result.getTitle());
        verify(tenantRepository, times(1)).findByClientId("test-clinic");
    }

    @Test
    void testFindByTenantIdNotFound() {
        // Given
        when(tenantRepository.findByClientId("non-existent")).thenReturn(Optional.empty());

        // When
        Tenant result = tenantService.findByTenantId("non-existent");

        // Then
        assertNull(result);
        verify(tenantRepository, times(1)).findByClientId("non-existent");
    }

    @Test
    void testIsExistsByTenantId() {
        // Given
        when(tenantRepository.existsByClientId("test-clinic")).thenReturn(true);

        // When
        Status result = tenantService.isExistsByTenantId("test-clinic");

        // Then
        assertTrue(result.isStatus());
        assertEquals("Tenant exists", result.getMessage());
        verify(tenantRepository, times(1)).existsByClientId("test-clinic");
    }

    @Test
    void testIsExistsByTenantIdNotExists() {
        // Given
        when(tenantRepository.existsByClientId("non-existent")).thenReturn(false);

        // When
        Status result = tenantService.isExistsByTenantId("non-existent");

        // Then
        assertFalse(result.isStatus());
        assertEquals("Tenant does not exist", result.getMessage());
        verify(tenantRepository, times(1)).existsByClientId("non-existent");
    }

    @Test
    void testRequest() {
        // Given
        when(tenantRequestRepository.save(any(TenantRequest.class))).thenReturn(testTenantRequest);

        // When
        Status result = tenantService.request(testTenantRequestDto, "testclinic");

        // Then
        assertTrue(result.isStatus());
        assertEquals("Tenant request submitted successfully", result.getMessage());
        verify(tenantRequestRepository, times(1)).save(any(TenantRequest.class));
    }

    @Test
    void testApprove() {
        // Given
        when(tenantRequestRepository.findById(1L)).thenReturn(Optional.of(testTenantRequest));
        when(tenantRepository.existsByClientId(anyString())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(testTenant);
        when(tenantRequestRepository.save(any(TenantRequest.class))).thenReturn(testTenantRequest);

        // When
        Status result = tenantService.approve(1L, "testclinic");

        // Then
        assertTrue(result.isStatus());
        assertEquals("Tenant request approved successfully", result.getMessage());
        verify(tenantRequestRepository, times(1)).findById(1L);
        verify(tenantRepository, times(1)).save(any(Tenant.class));
        verify(tenantRequestRepository, times(1)).save(any(TenantRequest.class));
    }

    @Test
    void testApproveRequestNotFound() {
        // Given
        when(tenantRequestRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Status result = tenantService.approve(999L, "testclinic");

        // Then
        assertFalse(result.isStatus());
        assertEquals("Tenant request not found", result.getMessage());
        verify(tenantRequestRepository, times(1)).findById(999L);
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testGetAllTenantRequests() {
        // Given
        TenantRequestProj requestProj1 = mock(TenantRequestProj.class);
        TenantRequestProj requestProj2 = mock(TenantRequestProj.class);
        List<TenantRequestProj> requestList = Arrays.asList(requestProj1, requestProj2);
        
        when(tenantRequestRepository.findAllTenantRequest()).thenReturn(requestList);

        // When
        List<TenantRequestProj> result = tenantService.getAllTenantRequests();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(tenantRequestRepository, times(1)).findAllTenantRequest();
    }

    @Test
    void testFilterAllTenant() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        TenantProj tenantProj1 = mock(TenantProj.class);
        TenantProj tenantProj2 = mock(TenantProj.class);
        List<TenantProj> tenantList = Arrays.asList(tenantProj1, tenantProj2);
        Page<TenantProj> tenantPage = new PageImpl<>(tenantList, pageable, 2);
        
        when(tenantRepository.searchTenants(pageable, "test")).thenReturn(tenantPage);

        // When
        Page<TenantProj> result = tenantService.filterAllTenant(pageable, testTenantFilter);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());
        verify(tenantRepository, times(1)).searchTenants(pageable, "test");
    }

    @Test
    void testFilterAllTenantWithNullFilter() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        TenantProj tenantProj1 = mock(TenantProj.class);
        List<TenantProj> tenantList = Arrays.asList(tenantProj1);
        Page<TenantProj> tenantPage = new PageImpl<>(tenantList, pageable, 1);
        
        when(tenantRepository.searchTenants(pageable, null)).thenReturn(tenantPage);

        // When
        Page<TenantProj> result = tenantService.filterAllTenant(pageable, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(tenantRepository, times(1)).searchTenants(pageable, null);
    }

    @Test
    void testUpload() {
        // Given
        MultipartFile logoFile = mock(MultipartFile.class);
        MultipartFile favFile = mock(MultipartFile.class);
        MultipartFile bannerFile = mock(MultipartFile.class);
        
        when(logoFile.isEmpty()).thenReturn(false);
        when(favFile.isEmpty()).thenReturn(false);
        when(bannerFile.isEmpty()).thenReturn(false);
        when(logoFile.getOriginalFilename()).thenReturn("logo.png");
        when(favFile.getOriginalFilename()).thenReturn("favicon.ico");
        when(bannerFile.getOriginalFilename()).thenReturn("banner.jpg");

        // When
        WebInfo result = tenantService.upload(logoFile, favFile, bannerFile);

        // Then
        assertNotNull(result);
        // Additional assertions would depend on the actual implementation
        // of the upload method and file handling logic
    }

    @Test
    void testFindWebInfoByClientId() {
        // Given
        String clientId = "test-clinic";

        // When & Then
        assertDoesNotThrow(() -> {
            tenantService.findWebInfoByClientId(clientId);
        });
        
        // This method appears to be void, so we just verify it doesn't throw exceptions
        // Additional verifications would depend on the actual implementation
    }

    @Test
    void testCreateUserWithNullDto() {
        // When & Then
        assertThrows(NullPointerException.class, () -> {
            tenantService.createUser(null);
        });
    }

    @Test
    void testRequestWithInvalidData() {
        // Given
        TenantRequestDto invalidDto = new TenantRequestDto();
        // Leave required fields null

        // When
        Status result = tenantService.request(invalidDto, "testclinic");

        // Then
        // The actual behavior would depend on validation in the implementation
        // This test ensures the method handles invalid input gracefully
        assertNotNull(result);
    }
}
