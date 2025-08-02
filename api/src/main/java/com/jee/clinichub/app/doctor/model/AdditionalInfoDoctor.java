package com.jee.clinichub.app.doctor.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourse;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncil;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollege;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
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
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "doctor_additional")
@EntityListeners(AuditingEntityListener.class)
public class AdditionalInfoDoctor extends Auditable<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registation_number")
    private String registationNumber;

    @OneToOne
    @JoinColumn(name = "medical_council_id")
    private MedicalCouncil medicalCouncil;

    @OneToOne
    @JoinColumn(name = "medical_course_id")
    private MedicalCourse medicalCourse;

    @OneToOne
    @JoinColumn(name = "medical_university_id")
    private MedicalUniversity medicalUniversity;

    @Column(name = "registation_year")
    private String registationYear;

    @OneToOne
    @JoinColumn(name = "college_id")
    private MedicalCollege college;

    @Column(name = "year_completion_degree")
    private String yearCompletionDegree;

    @Column(name = "establishment_type")
    private String establishmentType;

    @Column(name = "establishment_name")
    private String establishmentName;

    @Column(name = "establishment_city")
    private String establishmentCity;

    @OneToOne
    @JoinColumn(name = "establishment_district_id")
    private District district;

}
