
package com.jee.clinichub.app.laboratory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.laboratory.model.TestCategoryDTO;
import com.jee.clinichub.app.laboratory.model.TestTypeDTO;
import com.jee.clinichub.app.laboratory.model.TestParameterDTO;
import com.jee.clinichub.app.laboratory.service.TestCategoryService;
import com.jee.clinichub.global.model.Status;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/v1/laboratory/categories")
@Tag(name = "Test Categories", description = "Laboratory Test Categories Management")
public class TestCategoryController {

    @Autowired
    private TestCategoryService testCategoryService;

    @GetMapping("/list")
    @Operation(summary = "Get all test categories")
    public ResponseEntity<List<TestCategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(testCategoryService.getAllCategories());
    }

    @GetMapping("/list/active-with-types")
    @Operation(summary = "Get all active categories with test types")
    public ResponseEntity<List<TestCategoryDTO>> getAllActiveCategoriesWithTestTypes() {
        return ResponseEntity.ok(testCategoryService.getAllActiveCategoriesWithTestTypes());
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get test category by ID")
    public ResponseEntity<TestCategoryDTO> getCategoryById(@PathVariable Long id) {
        TestCategoryDTO category = testCategoryService.getCategoryById(id);
        return category != null ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }

    @PostMapping("/saveOrUpdate")
    @Operation(summary = "Save or update test category")
    public ResponseEntity<Status> saveCategoryOrUpdate(@RequestBody TestCategoryDTO testCategoryDTO) {
        return ResponseEntity.ok(testCategoryService.saveCategoryOrUpdate(testCategoryDTO));
    }

    // Test Types endpoints
    @GetMapping("/{categoryId}/test-types")
    @Operation(summary = "Get test types by category")
    public ResponseEntity<List<TestTypeDTO>> getTestTypesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(testCategoryService.getTestTypesByCategory(categoryId));
    }

    @GetMapping("/test-types/id/{id}")
    @Operation(summary = "Get test type by ID")
    public ResponseEntity<TestTypeDTO> getTestTypeById(@PathVariable Long id) {
        TestTypeDTO testType = testCategoryService.getTestTypeById(id);
        return testType != null ? ResponseEntity.ok(testType) : ResponseEntity.notFound().build();
    }

    @GetMapping("/test-types/id/{id}/with-parameters")
    @Operation(summary = "Get test type by ID with parameters")
    public ResponseEntity<TestTypeDTO> getTestTypeByIdWithParameters(@PathVariable Long id) {
        TestTypeDTO testType = testCategoryService.getTestTypeByIdWithParameters(id);
        return testType != null ? ResponseEntity.ok(testType) : ResponseEntity.notFound().build();
    }

    @PostMapping("/test-types/saveOrUpdate")
    @Operation(summary = "Save or update test type")
    public ResponseEntity<Status> saveTestTypeOrUpdate(@RequestBody TestTypeDTO testTypeDTO) {
        return ResponseEntity.ok(testCategoryService.saveTestTypeOrUpdate(testTypeDTO));
    }

    // Test Parameters endpoints
    @GetMapping("/test-types/{testTypeId}/parameters")
    @Operation(summary = "Get parameters by test type")
    public ResponseEntity<List<TestParameterDTO>> getParametersByTestType(@PathVariable Long testTypeId) {
        return ResponseEntity.ok(testCategoryService.getParametersByTestType(testTypeId));
    }

    @GetMapping("/parameters/id/{id}")
    @Operation(summary = "Get parameter by ID")
    public ResponseEntity<TestParameterDTO> getParameterById(@PathVariable Long id) {
        TestParameterDTO parameter = testCategoryService.getParameterById(id);
        return parameter != null ? ResponseEntity.ok(parameter) : ResponseEntity.notFound().build();
    }

    @PostMapping("/parameters/saveOrUpdate")
    @Operation(summary = "Save or update test parameter")
    public ResponseEntity<Status> saveParameterOrUpdate(@RequestBody TestParameterDTO testParameterDTO) {
        return ResponseEntity.ok(testCategoryService.saveParameterOrUpdate(testParameterDTO));
    }
}
