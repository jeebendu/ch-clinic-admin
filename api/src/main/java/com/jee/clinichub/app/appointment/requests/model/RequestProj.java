package com.jee.clinichub.app.appointment.requests.model;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentTypeProj;
import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.appointment.visitType.model.VisitTypeProj;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorProj;

import java.util.Date;

public interface RequestProj {
    
    Long getId();
    String getFirstName();
    String getLastName();
    String getEmail();
    String getPhone();
    Date getAppointmentDate();
    Boolean getIsAccept();
    Boolean getIsReject();
    Date getDob();
    Integer getGender();
    DoctorProj getDoctor();
    Branch getBranch();
    District getDistrict();
    Country getCountry();
    State getState();
    String getCity();
    AppointmentTypeProj getAppointmentType();
    VisitTypeProj getVisitType();
}
