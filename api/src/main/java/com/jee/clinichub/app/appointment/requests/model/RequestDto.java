package com.jee.clinichub.app.appointment.requests.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.model.DoctorDto;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestDto {
    private Long id;

    private String firstName;

    private String lastName;

    private Boolean isAccept;

    private Boolean isReject;

    @NotNull(message = "Email is mandatory")
    private String email;

    @NotNull(message = "Mobile is mandatory" )
    private String phone;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentDate;

    private DoctorDto doctor;

    private Date dob;

  private Branch branch;

    private AppointmentType appointmentType;

    private VisitType visitType;

    private Integer gender;

    private District district;

    private Country country;

    private State state;

    private String city;

    public RequestDto(Request request) {
        this.id = request.getId();
        this.firstName = request.getFirstName();
        this.lastName = request.getLastName();
        this.email = request.getEmail();
        this.phone = request.getPhone();
        this.appointmentDate = request.getAppointmentDate();
        this.isAccept = request.getIsAccept();
        this.isReject = request.getIsReject();
        this.doctor = new DoctorDto(request.getDoctor());
        this.dob = request.getDob();
        this.appointmentType = request.getAppointmentType();
        this.visitType = request.getVisitType();
        this.gender = request.getGender();
        this.city = request.getCity();
        this.country = request.getCountry();
        this.state = request.getState();
        this.district = request.getDistrict();
        if(request.getBranch()!=null){
          this.branch=request.getBranch();
      }
    }

}
