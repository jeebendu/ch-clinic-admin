
package com.jee.clinichub.app.laboratory.service;

import java.util.List;

import com.jee.clinichub.app.laboratory.model.TestCategoryDTO;
import com.jee.clinichub.app.laboratory.model.TestTypeDTO;
import com.jee.clinichub.app.laboratory.model.TestParameterDTO;
import com.jee.clinichub.global.model.Status;

public interface TestCategoryService {
    
    List<TestCategoryDTO> getAllCategories();
    
    List<TestCategoryDTO> getAllActiveCategoriesWithTestTypes();
    
    TestCategoryDTO getCategoryById(Long id);
    
    List<TestTypeDTO> getTestTypesByCategory(Long categoryId);
    
    TestTypeDTO getTestTypeById(Long id);
    
    TestTypeDTO getTestTypeByIdWithParameters(Long id);
    
    List<TestParameterDTO> getParametersByTestType(Long testTypeId);
    
    TestParameterDTO getParameterById(Long id);
    
    Status saveCategoryOrUpdate(TestCategoryDTO testCategoryDTO);
    
    Status saveTestTypeOrUpdate(TestTypeDTO testTypeDTO);
    
    Status saveParameterOrUpdate(TestParameterDTO testParameterDTO);
}
