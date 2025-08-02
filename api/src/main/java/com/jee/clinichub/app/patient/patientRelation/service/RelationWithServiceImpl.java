package com.jee.clinichub.app.patient.patientRelation.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWithDTO;
import com.jee.clinichub.app.patient.patientRelation.repository.RelationWithRepo;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RelationWithServiceImpl implements RelationWithService {

    private final RelationWithRepo relationWithRepo;

    @Override
    public Status delete(Long id) {
        relationWithRepo.findById(id).ifPresentOrElse(relationWithRepo::delete, () -> {
            throw new RuntimeException("RelationWith not found");
        });
        return new Status(true, "RelationWith Deleted Successfully");
    }

    @Override
    public List<RelationWithDTO> findAllByPatientId(Long patientId) {
        return relationWithRepo.findAllByPatient_id(patientId).stream().map(RelationWithDTO::new).toList();
    }

    @Override
    public List<RelationWithDTO> findAll() {
        return relationWithRepo.findAll().stream().map(RelationWithDTO::new).toList();
    }

    @Override
    public RelationWithDTO findById(Long id) {
        return relationWithRepo.findById(id).map(RelationWithDTO::new).orElseThrow(() -> {
            throw new RuntimeException("RelationWith not found");
        });
    }

    @Override
    public Status saveOrUpdate(RelationWithDTO relationWithDTO) {
        try {
            RelationWith relationWith = relationWithDTO.getId() == null ? new RelationWith(relationWithDTO)
                    : setRelationInfo(relationWithDTO);
            relationWithRepo.save(relationWith);

            return new Status(true, "Saved Successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public RelationWith setRelationInfo(RelationWithDTO relationWithDTO) {
        RelationWith relationWith = relationWithRepo.findById(relationWithDTO.getId()).orElseThrow(() -> {
            throw new RuntimeException("RelationWith not found");
        });
        relationWith.setRelationship(relationWithDTO.getRelationship());
        relationWith.setName(relationWithDTO.getName());
        relationWith.setAge(relationWithDTO.getAge());
        relationWith.setGender(relationWithDTO.getGender());
        relationWith.setPhone(relationWithDTO.getPhone());
        return relationWith;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public RelationWith findByGlobalId(UUID globalId) {
        try {
            Optional<RelationWith> relativeOptional = relationWithRepo.findByGlobalId(globalId);
            if (relativeOptional.isEmpty()) {
                return null;
            }
            return relativeOptional.get();
        } catch (Exception e) {
            return null;
        }
    }

}
