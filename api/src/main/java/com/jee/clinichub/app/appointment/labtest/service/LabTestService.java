package com.jee.clinichub.app.appointment.labtest.service;



import java.util.List;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.labtest.model.LabTestDTO;
import com.jee.clinichub.global.model.Status;



public interface LabTestService {

    List<LabTestDTO> getAll();

    LabTestDTO getById(Long id);

    Status saveOrUpdate(LabTestDTO labTestDTO);

    Status deleteById(Long id);

    List<LabTest> filterLabTests(LabTestDTO filter);
	


}
