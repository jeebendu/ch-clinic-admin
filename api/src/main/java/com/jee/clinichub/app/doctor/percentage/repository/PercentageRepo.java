package com.jee.clinichub.app.doctor.percentage.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.doctor.percentage.model.Percentage;

@Repository
public interface PercentageRepo  extends JpaRepository<Percentage,Long>{

    boolean existsByEnquiryServiceType_idAndDoctor_idAndIdNot(Long id, Long id2, Long id3);

    List<Percentage> findAllByDoctor_id(Long id);

    List<Percentage> findAllByDoctor_IdAndEnquiryServiceType_NameContainingIgnoreCase(Long id, String name);

    

}
