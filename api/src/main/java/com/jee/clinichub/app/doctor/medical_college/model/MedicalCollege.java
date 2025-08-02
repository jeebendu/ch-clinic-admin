package com.jee.clinichub.app.doctor.medical_college.model;
import java.io.Serializable;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourse;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;
import com.jee.clinichub.config.audit.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Table(name = "medical_college")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalCollege extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToOne
    @JoinColumn(name = "state_id")
    private State state;


    @OneToOne
    @JoinColumn(name = "university_id")
    private MedicalUniversity university;

    public MedicalCollege(MedicalCollegeDto medicalCollegeDto) {
        this.id = medicalCollegeDto.getId();
        this.name = medicalCollegeDto.getName();
        this.state = new State(medicalCollegeDto.getState());
        this.university = new MedicalUniversity(medicalCollegeDto.getUniversity());
    }
}
