package com.jee.clinichub.app.patient.patientRelation.model;

import java.io.Serializable;
import java.util.UUID;

import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "patient_relation")
public class RelationWith extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private String name;
    private String gender;
    private Integer age;
    private String phone;
    private String relationship;

    @Column(name = "global_id", unique = true)
    private UUID globalId;

    @PrePersist
    public void generateSlugAndGlobalUuid() {
        if (this.globalId == null) {
            this.globalId = java.util.UUID.randomUUID();
        }
    }

    public RelationWith(RelationWithDTO relation) {
        this.id = relation.getId();
        this.patient = new Patient(relation.getPatient());
        this.name = relation.getName();
        this.age = relation.getAge();
        this.gender = relation.getGender();
        this.relationship = relation.getRelationship();
        this.phone = relation.getPhone();
        this.globalId = relation.getGlobalId();
    }

    public static RelationWith fromDto(RelationWith relative) {
        RelationWith relativeObj = new RelationWith();

        relativeObj.setName(relative.getName());
        relativeObj.setAge(relative.getAge());
        relativeObj.setGender(relative.getGender());
        relativeObj.setRelationship(relative.getRelationship());
        relativeObj.setPhone(relative.getPhone());
        relativeObj.setGlobalId(relative.getGlobalId());
        relativeObj.setPatient(relative.getPatient());
        return relativeObj;
    }

}
