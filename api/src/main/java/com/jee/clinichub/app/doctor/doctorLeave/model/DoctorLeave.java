package com.jee.clinichub.app.doctor.doctorLeave.model;

import java.io.Serializable;
import java.util.Date;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctor_leave")
public class DoctorLeave extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @Column(name = "leave_start")
    private Date leaveStart;

    @Column(name = "leave_end")
    private Date leaveEnd;

    @Column(name = "reason")
    private String reason;

    private boolean approved;

    public DoctorLeave(DoctorLeaveDTO leaveDTO) {
        if (leaveDTO.getId() != null) {
            this.id = leaveDTO.getId();
        }

        if (leaveDTO.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranch(leaveDTO.getDoctorBranch());
        }
        this.reason = leaveDTO.getReason();
        this.leaveEnd = leaveDTO.getLeaveEnd();
        this.leaveStart = leaveDTO.getLeaveStart();
    }

}
