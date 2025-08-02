package com.jee.clinichub.app.patient.patientServiceHandler.model;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Builder
@Entity
@Table(name = "patient_service_map")
public class PatientServiceHandler extends Auditable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "service_type_id", nullable = true)
    private EnquiryServiceType enquiryservicetype;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient patient;

    public PatientServiceHandler(PatientServiceHandlerDTO sHandlerDTO){
        this.id=sHandlerDTO.getId();
        this.enquiryservicetype=new EnquiryServiceType(sHandlerDTO.getEnquiryservicetype());
        this.patient=new Patient(sHandlerDTO.getPatient());
    }
}