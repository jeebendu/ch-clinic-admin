package com.jee.clinichub.app.repair.repairTestDelivery.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairDto;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "repair_test_delivery")
public class RepairTestDelivery   implements Serializable{

    private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	@JoinColumn(name = "repair_id", nullable = false)
	private Repair repair;

	@OneToOne
    @JoinColumn(name="hearing_add-checked_by")
	private Staff hearingAddCheckedBy;

    @Column(name="check_date")
	private Date checkDate;

    @OneToOne
    @JoinColumn(name="informed_to_patient_by")
	private Staff informedToPatientBy;

    @Column(name="informed_date")
	private Date informedDate;

    @Column(name="recieved_by")
	private String recievedBy;

    @Column(name="recieved_date")
	private Date recievedDate;

    @OneToOne
    @JoinColumn(name="given_by")
	private Staff givenBy;

    @Column(name="given_date")
	private Date givenDate;
    

    public RepairTestDelivery(RepairTestDeliveryDto repairTestDeliveryDto) {
        this.id = repairTestDeliveryDto.getId();
        this.repair=new Repair(repairTestDeliveryDto.getRepair());
        this.hearingAddCheckedBy =new Staff( repairTestDeliveryDto.getHearingAddCheckedBy());
        this.checkDate = repairTestDeliveryDto.getCheckDate();
        this.informedToPatientBy = new Staff(repairTestDeliveryDto.getInformedToPatientBy());
        this.informedDate = repairTestDeliveryDto.getInformedDate();
        this.recievedBy = repairTestDeliveryDto.getRecievedBy();
        this.recievedDate = repairTestDeliveryDto.getRecievedDate();
        this.givenBy = new Staff(repairTestDeliveryDto.getGivenBy());
        this.givenDate = repairTestDeliveryDto.getGivenDate();
    }
}
