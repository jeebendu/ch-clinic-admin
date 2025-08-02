package com.jee.clinichub.app.appointment.referral.model;


import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
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
@Table(name = "visit_referral_commissions")
@EntityListeners(AuditingEntityListener.class)
public class ReferralCommissions extends Auditable<String> implements Serializable{
    
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "visit_id")
    private Schedule visit;
    
    @OneToOne
    @JoinColumn(name = "referral_doctor_id")
    private Doctor referralDoctor;

    @Column(name = "commission_amount")
    private Double commissionAmount;

    @Column(name = "status")
    private ReferralCommissionStatus status;

    @Column(name = "calculated_on")
    private Date calculatedOn;

    public ReferralCommissions(ReferralCommissionsDto commissionsDto) {
    if (commissionsDto != null) {
        this.id = commissionsDto.getId();
        this.visit = new Schedule(commissionsDto.getVisit());
        this.referralDoctor = new Doctor(commissionsDto.getReferralDoctor());
        this.commissionAmount = commissionsDto.getCommissionAmount();
        this.status = commissionsDto.getStatus();
        this.calculatedOn = commissionsDto.getCalculatedOn();
    }
} 
}
