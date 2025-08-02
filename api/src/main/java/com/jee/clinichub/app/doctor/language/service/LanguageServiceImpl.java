package com.jee.clinichub.app.doctor.language.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.jee.clinichub.app.doctor.language.model.LanguageDto;
import com.jee.clinichub.app.doctor.language.repository.LanguageRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {

    private final LanguageRepo languageRepo;

    @Override
    public List<LanguageDto> getAllLanguage() {
        return languageRepo.findAll().stream().map(LanguageDto::new).toList();
    }

}
