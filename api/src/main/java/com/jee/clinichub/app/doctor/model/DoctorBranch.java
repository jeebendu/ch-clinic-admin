package com.jee.clinichub.app.doctor.model;

import java.util.UUID;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.global.utility.SlugUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "doctor_branch")
@ToString(exclude = { "doctor" })
@EqualsAndHashCode(callSuper = false, exclude = { "doctor" })
@EntityListeners(AuditingEntityListener.class)
public class DoctorBranch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @JsonIgnore
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;


    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "global_doctor_branch_id", unique = true)
    private UUID globalDoctorBranchId;

    @PrePersist
    public void generateSlugAndGlobalUuid() {
        if (this.globalDoctorBranchId == null) {
            this.globalDoctorBranchId = UUID.randomUUID();
        }
    }

    public DoctorBranch(DoctorBranchDto doctorBranch) {
        this.id = doctorBranch.getId();
        // Use the improved fromDto method that handles existing branches properly
        this.branch = Branch.fromDto(doctorBranch.getBranch());
        this.consultationFee = doctorBranch.getConsultationFee();
        this.globalDoctorBranchId = doctorBranch.getGlobalDoctorBranchId();
    }
}
