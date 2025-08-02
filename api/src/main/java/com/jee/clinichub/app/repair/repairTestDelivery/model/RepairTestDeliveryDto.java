package com.jee.clinichub.app.repair.repairTestDelivery.model;

import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairDto;
import com.jee.clinichub.app.staff.model.StaffDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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


public class RepairTestDeliveryDto {
    private Long id;
    private RepairDto repair;
	private StaffDto hearingAddCheckedBy;
	private Date checkDate;
	private StaffDto informedToPatientBy;
	private Date informedDate;
	private String recievedBy;
	private Date recievedDate;
	private StaffDto givenBy;
	private Date givenDate;

    public RepairTestDeliveryDto(RepairTestDelivery repairTestDelivery) {
        this.id = repairTestDelivery.getId();
        this.repair=new RepairDto(repairTestDelivery.getRepair());
        this.hearingAddCheckedBy =new StaffDto( repairTestDelivery.getHearingAddCheckedBy());
        this.checkDate = repairTestDelivery.getCheckDate();
        this.informedToPatientBy =new StaffDto( repairTestDelivery.getInformedToPatientBy());
        this.informedDate = repairTestDelivery.getInformedDate();
        this.recievedBy = repairTestDelivery.getRecievedBy();
        this.recievedDate = repairTestDelivery.getRecievedDate();
        this.givenBy = new StaffDto( repairTestDelivery.getGivenBy());
        this.givenDate = repairTestDelivery.getGivenDate();
       
    }
    
}
