package com.jee.clinichub.app.appointment.prescription.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "prescription_laboratory_test")
@EntityListeners(AuditingEntityListener.class)

public class LaboratoryTest extends Auditable<String>  implements Serializable{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lab_test_id")
    private LabTest labTest;
    private String instructions;
    
    @JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "prescription_id")
	private Prescription prescription;

    public LaboratoryTest(LaboratoryTestDTO test){
       if(test.getId()!=null){
            this.id=test.getId();
        }
        this.labTest=new LabTest(test.getLabTest());
        this.instructions=test.getInstructions();
    }

}
