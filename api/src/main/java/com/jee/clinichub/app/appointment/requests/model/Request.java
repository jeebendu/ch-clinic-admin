package com.jee.clinichub.app.appointment.requests.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.model.Doctor;
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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
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
@Table(name = "appointment_request")
@EntityListeners(AuditingEntityListener.class)
public class Request extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "appointment_date")
    private Date appointmentDate;

    @Column(name = "is_accept")
    private Boolean isAccept;

    @Column(name = "is_reject")
    private Boolean isReject;

    @OneToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;
    

    private Date dob;

    private Integer gender;

    @OneToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "district_id")
    private District district;
    
    @OneToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @OneToOne
    @JoinColumn(name = "state_id")
    private State state;

    private String city;

    @OneToOne
    @JoinColumn(name = "appointment_type_id")
    private AppointmentType appointmentType;

    @OneToOne
    @JoinColumn(name = "visit_type_id")
    private VisitType visitType;

    public Request(RequestDto requestDto) {
        this.id = requestDto.getId();
        this.firstName = requestDto.getFirstName();
        this.lastName = requestDto.getLastName();
        this.email = requestDto.getEmail();
        this.phone = requestDto.getPhone();
        this.appointmentDate = requestDto.getAppointmentDate();
        this.isAccept = requestDto.getIsAccept();
        this.isReject = requestDto.getIsReject();
        this.doctor = new Doctor(requestDto.getDoctor());
        this.dob = requestDto.getDob();
        this.appointmentType = requestDto.getAppointmentType();
        this.visitType = requestDto.getVisitType();
        this.gender = requestDto.getGender(); 
        this.city=requestDto.getCity();
        this.country=requestDto.getCountry();
        this.state=requestDto.getState();
        this.district=requestDto.getDistrict();
        if(requestDto.getBranch()!=null){
            this.branch=requestDto.getBranch();
        }
        

    }

}
