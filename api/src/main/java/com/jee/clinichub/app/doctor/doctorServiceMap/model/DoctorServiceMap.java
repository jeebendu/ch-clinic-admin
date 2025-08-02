package com.jee.clinichub.app.doctor.doctorServiceMap.model;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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

@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "doctor_service_map")
@EntityListeners(AuditingEntityListener.class)

public class DoctorServiceMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @OneToOne
    @JoinColumn(name = "service_type_id")
    private EnquiryServiceType serviceType;

    private Double price;

    public DoctorServiceMap(DoctorServiceMapDto doctorServiceMapDto) {
        this.id = doctorServiceMapDto.getId();
        this.doctorBranch = new DoctorBranch(doctorServiceMapDto.getDoctorBranch());
        this.serviceType = new EnquiryServiceType(doctorServiceMapDto.getServiceType());
        this.price = doctorServiceMapDto.getPrice();
    }
}