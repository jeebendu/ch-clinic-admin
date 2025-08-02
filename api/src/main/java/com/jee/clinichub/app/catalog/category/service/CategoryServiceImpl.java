package com.jee.clinichub.app.catalog.category.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.catalog.category.model.Category;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.category.repository.CategoryRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "categoryService")
public class CategoryServiceImpl implements CategoryService {
	
	private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);

    @Autowired
    private CategoryRepository categoryRepository;
    
	@Override
	public Status saveOrUpdate(CategoryDto categoryDto) {
		try{
			
			boolean isExistName = (categoryDto.getId()==null) ? categoryRepository.existsByName(categoryDto.getName()): categoryRepository.existsByNameAndIdNot(categoryDto.getName(),categoryDto.getId());
			
			if(isExistName){return new Status(false,"Category Name already exist");}
	    	
			Category category = new Category();
			
			if(categoryDto.getId()==null) {
				category = new Category(categoryDto);
			}else{
				category = this.setCategory(categoryDto);
			}
			
			category = categoryRepository.save(category);
			return new Status(true,( (categoryDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Category setCategory(CategoryDto categoryDto) {
    	Category exCategory = categoryRepository.findById(categoryDto.getId()).get();
    	exCategory.setName(categoryDto.getName());
		return exCategory;
		
	}

	@Override
  	public List<CategoryDto> getAllCategorys() {
    	List<Category> categoryList = categoryRepository.findByOrderByNameAsc();
    	List<CategoryDto> categoryDtoList = categoryList.stream().map(CategoryDto::new).collect(Collectors.toList());
  		return categoryDtoList;
  	}

    @Override
    public Category findByName(String name) {
        Category category = categoryRepository.findCategoryByName(name);
        return category;
    }
    
    
	@Override
	public CategoryDto getById(Long id) {
		CategoryDto categoryDto = new CategoryDto();
		try{
			Optional<Category> category = categoryRepository.findById(id);
			if(category.isPresent()){
				categoryDto = new CategoryDto(category.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return categoryDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Category> category = categoryRepository.findById(id);
			if(!category.isPresent()){
				return new Status(false,"Category Not Found");
			}
			
			categoryRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}
