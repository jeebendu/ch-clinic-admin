package com.jee.clinichub.app.core.country.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.country.model.CountryDto;
import com.jee.clinichub.app.core.country.repository.CountryRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value="CountrySv")
public class CountrySvImp implements CountrySv{
	
	@Autowired
	private CountryRepository countryRepository;

	@Override
	public List<CountryDto> getAllenquiryService() {
		List<Country> countryList=countryRepository.findAll();
		List<CountryDto> countryDtoList=countryList.stream().map(CountryDto::new).toList() ;
		return countryDtoList;
	}

	@Override
	public CountryDto getById(Long id) {
		CountryDto countryDto=new CountryDto();
		try {
			Optional<Country> country = countryRepository.findById(id);
			if(country.isPresent()) {
				countryDto= new CountryDto(country.get());		
			}
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return countryDto;
	}

	@Override
	public Status saveOrUpdate(@Valid CountryDto countryDto) {
		try {
			Country country=new Country();
			if(countryDto.getId()==null) {
				country=new Country(countryDto);	
			}
			else {
				country=this.setCountry(countryDto);
			}
			countryRepository.save(country);
			return new Status(true,((countryDto.getId() == null) ? "Added" : "Updated") + " Successfully");
			
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return  new Status(false,"Something went wrong");
	}

	private Country setCountry(@Valid CountryDto countryDto) {
		Country excountry=new Country();
		
		try {
			excountry=countryRepository.findById(countryDto.getId()).get();	
			excountry.setName(countryDto.getName());
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return excountry;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Country> country=countryRepository.findById(id);
			if(!country.isPresent()) {
				return new Status(false,"Country Type not found");
			}
			
			countryRepository.deleteById(id);
			return new Status(true,"Deleted successfully");
		}
		catch(Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}


}
