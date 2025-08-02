
package com.jee.clinichub.app.laboratory.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.laboratory.model.TestCategory;
import com.jee.clinichub.app.laboratory.model.TestCategoryDTO;
import com.jee.clinichub.app.laboratory.model.TestType;
import com.jee.clinichub.app.laboratory.model.TestTypeDTO;
import com.jee.clinichub.app.laboratory.model.TestParameter;
import com.jee.clinichub.app.laboratory.model.TestParameterDTO;
import com.jee.clinichub.app.laboratory.repository.TestCategoryRepository;
import com.jee.clinichub.app.laboratory.repository.TestTypeRepository;
import com.jee.clinichub.app.laboratory.repository.TestParameterRepository;
import com.jee.clinichub.app.laboratory.service.TestCategoryService;
import com.jee.clinichub.global.model.Status;

@Service
@Transactional
public class TestCategoryServiceImpl implements TestCategoryService {

    @Autowired
    private TestCategoryRepository testCategoryRepository;

    @Autowired
    private TestTypeRepository testTypeRepository;

    @Autowired
    private TestParameterRepository testParameterRepository;

    @Override
    public List<TestCategoryDTO> getAllCategories() {
        return testCategoryRepository.findAll().stream()
                .map(TestCategoryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestCategoryDTO> getAllActiveCategoriesWithTestTypes() {
        return testCategoryRepository.findAllActiveWithTestTypes().stream()
                .map(TestCategoryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public TestCategoryDTO getCategoryById(Long id) {
        Optional<TestCategory> category = testCategoryRepository.findById(id);
        return category.map(TestCategoryDTO::new).orElse(null);
    }

    @Override
    public List<TestTypeDTO> getTestTypesByCategory(Long categoryId) {
        return testTypeRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(TestTypeDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public TestTypeDTO getTestTypeById(Long id) {
        Optional<TestType> testType = testTypeRepository.findById(id);
        return testType.map(TestTypeDTO::new).orElse(null);
    }

    @Override
    public TestTypeDTO getTestTypeByIdWithParameters(Long id) {
        TestType testType = testTypeRepository.findByIdWithParameters(id);
        return testType != null ? new TestTypeDTO(testType) : null;
    }

    @Override
    public List<TestParameterDTO> getParametersByTestType(Long testTypeId) {
        return testParameterRepository.findByTestTypeIdAndActiveTrue(testTypeId).stream()
                .map(TestParameterDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public TestParameterDTO getParameterById(Long id) {
        Optional<TestParameter> parameter = testParameterRepository.findById(id);
        return parameter.map(TestParameterDTO::new).orElse(null);
    }

    @Override
    public Status saveCategoryOrUpdate(TestCategoryDTO testCategoryDTO) {
        try {
            TestCategory testCategory;
            
            if (testCategoryDTO.getId() != null && testCategoryDTO.getId() > 0) {
                Optional<TestCategory> existing = testCategoryRepository.findById(testCategoryDTO.getId());
                if (existing.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test category not found")
                            .build();
                }
                testCategory = existing.get();
            } else {
                testCategory = new TestCategory();
            }

            testCategory.setName(testCategoryDTO.getName());
            testCategory.setDescription(testCategoryDTO.getDescription());
            testCategory.setActive(testCategoryDTO.getActive());

            TestCategory savedCategory = testCategoryRepository.save(testCategory);
            
            return Status.builder()
                    .status(true)
                    .message("Test category saved successfully")
                    //.data(new TestCategoryDTO(savedCategory))
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error saving test category: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public Status saveTestTypeOrUpdate(TestTypeDTO testTypeDTO) {
        try {
            TestType testType;
            
            if (testTypeDTO.getId() != null && testTypeDTO.getId() > 0) {
                Optional<TestType> existing = testTypeRepository.findById(testTypeDTO.getId());
                if (existing.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test type not found")
                            .build();
                }
                testType = existing.get();
            } else {
                testType = new TestType();
            }

            testType.setName(testTypeDTO.getName());
            testType.setDescription(testTypeDTO.getDescription());
            testType.setActive(testTypeDTO.getActive());

            if (testTypeDTO.getCategoryId() != null) {
                Optional<TestCategory> category = testCategoryRepository.findById(testTypeDTO.getCategoryId());
                if (category.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test category not found")
                            .build();
                }
                testType.setCategory(category.get());
            }

            TestType savedTestType = testTypeRepository.save(testType);
            
            return Status.builder()
                    .status(true)
                    .message("Test type saved successfully")
                    //.data(new TestTypeDTO(savedTestType))
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error saving test type: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public Status saveParameterOrUpdate(TestParameterDTO testParameterDTO) {
        try {
            TestParameter testParameter;
            
            if (testParameterDTO.getId() != null && testParameterDTO.getId() > 0) {
                Optional<TestParameter> existing = testParameterRepository.findById(testParameterDTO.getId());
                if (existing.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test parameter not found")
                            .build();
                }
                testParameter = existing.get();
            } else {
                testParameter = new TestParameter();
            }

            testParameter.setName(testParameterDTO.getName());
            testParameter.setUnit(testParameterDTO.getUnit());
            testParameter.setReferenceMin(testParameterDTO.getReferenceMin());
            testParameter.setReferenceMax(testParameterDTO.getReferenceMax());
            testParameter.setReferenceText(testParameterDTO.getReferenceText());
            testParameter.setActive(testParameterDTO.getActive());

            if (testParameterDTO.getTestTypeId() != null) {
                Optional<TestType> testType = testTypeRepository.findById(testParameterDTO.getTestTypeId());
                if (testType.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test type not found")
                            .build();
                }
                testParameter.setTestType(testType.get());
            }

            TestParameter savedParameter = testParameterRepository.save(testParameter);
            
            return Status.builder()
                    .status(true)
                    .message("Test parameter saved successfully")
                    //.data(new TestParameterDTO(savedParameter))
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error saving test parameter: " + e.getMessage())
                    .build();
        }
    }
}
