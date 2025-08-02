package com.jee.clinichub.app.doctor.language.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.language.model.LanguageDto;
import com.jee.clinichub.app.doctor.language.service.LanguageService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("v1/language/public")
public class PublicLanguageController {


    private final LanguageService languageService;


      @GetMapping(value = "/list")
    public List<LanguageDto> getPublicLanguageList() {
        return languageService.getAllLanguage();
    }
    
}
