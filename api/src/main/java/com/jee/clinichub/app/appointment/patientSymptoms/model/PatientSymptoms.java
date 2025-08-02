package com.jee.clinichub.app.appointment.patientSymptoms.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "patient_symptoms")
@EntityListeners(AuditingEntityListener.class)
public class PatientSymptoms extends Auditable<String> implements Serializable{
    
      private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "visit_id")
    private Schedule visit;

    @OneToOne
    @JoinColumn(name = "symptoms_id")
    private Symptoms symptoms;

    private String severity;

    public PatientSymptoms(PatientSymptomsDto symptomsDto) {
        if (symptomsDto != null) {
            this.id = symptomsDto.getId();
            this.visit = symptomsDto.getVisit() != null ? new Schedule(symptomsDto.getVisit()) : null;
            this.symptoms = symptomsDto.getSymptoms() != null ? new Symptoms(symptomsDto.getSymptoms()) : null;
            this.severity = symptomsDto.getSeverity();
        }
    }

}
