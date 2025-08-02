package com.jee.clinichub.app.appointment.visitMedicines.service;

import java.util.List;

import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.global.model.Status;

public interface VisitMedicinService {

    List<MedicinesDTO> findAllByVisitId(Long visitId);

    Status deleteById(Long id);

    Status saveOrUpdate(MedicinesDTO medicinesDto);

    MedicinesDTO getById(Long id);

    List<MedicinesDTO> getAll();
    
}
