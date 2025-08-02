package com.jee.clinichub.app.appointment.requests.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.jee.clinichub.app.appointment.requests.model.RequestDto;
import com.jee.clinichub.app.appointment.requests.model.RequestProj;
import com.jee.clinichub.app.appointment.requests.model.RequestSearch;
import com.jee.clinichub.app.appointment.requests.model.StatusDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface RequestService {

    List<RequestDto> getAllRequest();

    RequestDto getById(Long id);

    Status saveOrUpdate(@Valid RequestDto requestDto);

    Status deleteById(Long id);

    Status isAccept(Long id, StatusDto statusDto);

    Page<RequestProj> search(RequestSearch search, int pageNo, int pageSize);

    Status reSchedule(@Valid RequestDto requestDto);

    Status publicRequestSave(RequestDto requestDto);
    
}
