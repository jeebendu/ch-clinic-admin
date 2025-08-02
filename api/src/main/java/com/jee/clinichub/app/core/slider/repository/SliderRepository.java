package com.jee.clinichub.app.core.slider.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.slider.model.Slider;
import com.jee.clinichub.app.core.slider.model.SliderDto;
import com.jee.clinichub.app.core.slider.model.SliderProj;
@Repository
public interface SliderRepository extends JpaRepository<Slider, Long> {

    Page<SliderProj> findAllByActive(Pageable pr,boolean active);

    boolean existsBySortOrderAndIdNot(int sortOrder, long l);

    List<SliderDto> findAllByActive(boolean b);


    
} 