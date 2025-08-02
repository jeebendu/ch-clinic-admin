package com.jee.clinichub.app.core.country.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.country.model.Country;


@Repository
public interface CountryRepository extends JpaRepository<Country,Long>{

}
