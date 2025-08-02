package com.jee.clinichub.app.doctor.doctorLeave.model;

import java.util.Date;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorLeaveDTO {

    private Long id;
    private DoctorBranchDto doctorBranch;
    private Date leaveStart;
    private Date leaveEnd;
    private String reason;

    private boolean approved;

    public DoctorLeaveDTO(DoctorLeave leaveDTO) {
        if (leaveDTO.getId() != null) {
            this.id = leaveDTO.getId();
        }
        if (leaveDTO.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranchDto(leaveDTO.getDoctorBranch());
        }
        this.reason = leaveDTO.getReason();
        this.leaveEnd = leaveDTO.getLeaveEnd();
        this.leaveStart = leaveDTO.getLeaveStart();
    }
}
