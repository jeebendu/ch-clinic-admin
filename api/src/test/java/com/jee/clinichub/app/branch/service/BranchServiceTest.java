
package com.jee.clinichub.app.branch.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.sequence.repository.SequenceRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class BranchServiceTest {

    @Mock
    private BranchRepository branchRepository;

    @Mock
    private BranchSyncService branchSyncService;

    @Mock
    private BranchValidationService branchValidationService;

    @Mock
    private SequenceService sequenceService;

    @Mock
    private SequenceRepository sequenceRepository;

    @Mock
    private ClinicRepository clinicRepository;

    @InjectMocks
    private BranchServiceImpl branchService;

    private Branch testBranch;
    private BranchDto testBranchDto;
    private UUID testGlobalBranchId;
    private Clinic testClinic;
    private ClinicDto testClinicDto;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(branchService, "defaultTenant", "master");
        
        testGlobalBranchId = UUID.randomUUID();
        
        // Create test clinic
        testClinic = new Clinic();
        testClinic.setId(1L);
        testClinic.setName("Test Clinic");
        testClinic.setEmail("test@clinic.com");
        testClinic.setContact("1234567890");
        testClinic.setAddress("Test Address");
        
        testClinicDto = new ClinicDto();
        testClinicDto.setId(1L);
        testClinicDto.setName("Test Clinic");
        testClinicDto.setEmail("test@clinic.com");
        testClinicDto.setContact("1234567890");
        testClinicDto.setAddress("Test Address");
        
        testBranch = Branch.builder()
                .id(1L)
                .globalBranchId(testGlobalBranchId)
                .name("Test Branch")
                .code("TB001")
                .location("Test Location")
                .active(true)
                .primary(false)
                .clinic(testClinic)
                .build();

        testBranchDto = BranchDto.builder()
                .id(1L)
                .globalBranchId(testGlobalBranchId)
                .name("Test Branch")
                .code("TB001")
                .location("Test Location")
                .active(true)
                .primary(false)
                .clinic(testClinicDto)
                .build();
    }

    @Test
    void testGetAllBranches() {
        // Given
        List<Branch> branches = Arrays.asList(testBranch);
        when(branchRepository.findAll()).thenReturn(branches);

        // When
        List<BranchDto> result = branchService.getAllBranches();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Branch", result.get(0).getName());
        verify(branchRepository, times(1)).findAll();
    }

    @Test
    void testGetAllBranchesPaginated() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Branch> branches = Arrays.asList(testBranch);
        Page<Branch> branchPage = new PageImpl<>(branches, pageable, 1);
        when(branchRepository.findAll(pageable)).thenReturn(branchPage);

        // When
        Page<BranchDto> result = branchService.getAllBranchesPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Branch", result.getContent().get(0).getName());
        verify(branchRepository, times(1)).findAll(pageable);
    }

    @Test
    void testGetById() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("test_tenant");
            when(branchRepository.findOneById(1L)).thenReturn(Optional.of(testBranch));
            BranchDto result = branchService.getById(1L);
            assertNotNull(result);
            assertEquals("Test Branch", result.getName());
            assertEquals("TB001", result.getCode());
            verify(branchRepository, times(1)).findOneById(1L);
        }
    }

    @Test
    void testGetByIdNotFound() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("test_tenant");
            when(branchRepository.findOneById(999L)).thenReturn(Optional.empty());
            assertThrows(EntityNotFoundException.class, () -> branchService.getById(999L));
            verify(branchRepository, times(1)).findOneById(999L);
        }
    }

    @Test
    void testSaveOrUpdateNewBranch() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            BranchDto newBranchDto = BranchDto.builder()
                    .name("New Branch")
                    .code("NB001")
                    .location("New Location")
                    .active(true)
                    .clinic(testClinicDto)
                    .build();
            
            Branch savedBranch = Branch.builder()
                    .id(2L)
                    .globalBranchId(UUID.randomUUID())
                    .name("New Branch")
                    .code("NB001")
                    .location("New Location")
                    .active(true)
                    .clinic(testClinic)
                    .build();

            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("tenant1");
            when(branchValidationService.validateBranchForSave(any(BranchDto.class))).thenReturn(new Status(true, "Validation passed"));
            when(clinicRepository.findById(1L)).thenReturn(Optional.of(testClinic));
            when(branchRepository.save(any(Branch.class))).thenReturn(savedBranch);
            doNothing().when(sequenceService).createDefaultSequencesForBranch(any(Branch.class));
            doNothing().when(branchSyncService).syncBranchToMaster(any(BranchDto.class), eq("tenant1"));

            Status result = branchService.saveOrUpdate(newBranchDto);

            assertTrue(result.isStatus(), "Expected status to be true but was false. Message: " + result.getMessage());
            assertEquals("Added Successfully", result.getMessage());
            verify(branchValidationService, times(1)).validateBranchForSave(any(BranchDto.class));
            verify(clinicRepository, times(1)).findById(1L);
            verify(branchRepository, times(1)).save(any(Branch.class));
            verify(sequenceService, times(1)).createDefaultSequencesForBranch(any(Branch.class));
            verify(branchSyncService, times(1)).syncBranchToMaster(any(BranchDto.class), eq("tenant1"));
        }
    }

    @Test
    void testSaveOrUpdateExistingBranch() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("tenant1");
            when(branchValidationService.validateBranchForSave(testBranchDto)).thenReturn(new Status(true, "Validation passed"));
            when(branchRepository.findOneById(1L)).thenReturn(Optional.of(testBranch));
            when(clinicRepository.findById(1L)).thenReturn(Optional.of(testClinic));
            when(branchRepository.save(any(Branch.class))).thenReturn(testBranch);
            doNothing().when(branchSyncService).syncBranchToMaster(any(BranchDto.class), eq("tenant1"));

            Status result = branchService.saveOrUpdate(testBranchDto);

            assertTrue(result.isStatus(), "Expected status to be true but was false. Message: " + result.getMessage());
            assertEquals("Updated Successfully", result.getMessage());
            verify(branchValidationService, times(1)).validateBranchForSave(testBranchDto);
            verify(branchRepository, times(1)).findOneById(1L);
            verify(clinicRepository, times(1)).findById(1L);
            verify(branchRepository, times(1)).save(any(Branch.class));
            verify(branchSyncService, times(1)).syncBranchToMaster(any(BranchDto.class), eq("tenant1"));
        }
    }

    @Test
    void testSaveOrUpdateValidationFailed() {
        // Given
        when(branchValidationService.validateBranchForSave(testBranchDto))
                .thenReturn(new Status(false, "Branch Name already exists"));

        // When
        Status result = branchService.saveOrUpdate(testBranchDto);

        // Then
        assertFalse(result.isStatus());
        assertEquals("Branch Name already exists", result.getMessage());
        verify(branchValidationService, times(1)).validateBranchForSave(testBranchDto);
        verify(branchRepository, never()).save(any(Branch.class));
        verify(sequenceService, never()).createDefaultSequencesForBranch(any(Branch.class));
        verify(branchSyncService, never()).syncBranchToMaster(any(BranchDto.class), anyString());
    }

    @Test
    void testDeleteById() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("tenant1");
            when(branchRepository.findOneById(1L)).thenReturn(Optional.of(testBranch));
            when(sequenceRepository.findAllByBranch_id(1L)).thenReturn(List.of());
            doNothing().when(branchRepository).deleteById(1L);
            doNothing().when(branchSyncService).deleteBranchFromMaster(any(UUID.class), eq("tenant1"));

            Status result = branchService.deleteById(1L);

            assertTrue(result.isStatus(), "Expected delete to be successful. Message: " + result.getMessage());
            assertEquals("Deleted Successfully", result.getMessage());
            verify(branchRepository, times(1)).findOneById(1L);
            verify(branchRepository, times(1)).deleteById(1L);
            verify(branchSyncService, times(1)).deleteBranchFromMaster(testBranch.getGlobalBranchId(), "tenant1");
        }
    }

    @Test
    void testDeleteByIdNotFound() {
        try (MockedStatic<TenantContextHolder> mockedStatic = mockStatic(TenantContextHolder.class)) {
            mockedStatic.when(TenantContextHolder::getCurrentTenant).thenReturn("tenant1");
            when(branchRepository.findOneById(999L)).thenReturn(Optional.empty());

            Status result = branchService.deleteById(999L);

            assertFalse(result.isStatus());
            assertTrue(result.getMessage().contains("Branch not found with ID: 999"));
            verify(branchRepository, times(1)).findOneById(999L);
            verify(branchRepository, never()).deleteById(anyLong());
        }
    }

    @Test
    void testExistsByName() {
        // Given
        when(branchRepository.existsByName("Test Branch")).thenReturn(true);

        // When
        boolean result = branchService.existsByName("Test Branch");

        // Then
        assertTrue(result);
        verify(branchRepository, times(1)).existsByName("Test Branch");
    }

    @Test
    void testFindByName() {
        // Given
        when(branchRepository.findBranchByName("Test Branch")).thenReturn(Optional.of(testBranch));

        // When
        Branch result = branchService.findByName("Test Branch");

        // Then
        assertNotNull(result);
        assertEquals("Test Branch", result.getName());
        verify(branchRepository, times(1)).findBranchByName("Test Branch");
    }

    @Test
    void testGetDefaultBranch() {
        // Given
        when(branchRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(testBranch));

        // When
        Optional<Branch> result = branchService.getDefaultBranch();

        // Then
        assertTrue(result.isPresent());
        assertEquals("Test Branch", result.get().getName());
        verify(branchRepository, times(1)).findFirstByOrderByIdAsc();
    }
}
