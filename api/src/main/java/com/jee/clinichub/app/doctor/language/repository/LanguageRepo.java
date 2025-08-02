package com.jee.clinichub.app.doctor.language.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.doctor.language.model.Language;

@Repository
public interface LanguageRepo extends JpaRepository<Language,Long>{
    
}
