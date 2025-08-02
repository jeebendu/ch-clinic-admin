package com.jee.clinichub.app.repair.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.utility.DateUtility;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;




/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "repair")
@EntityListeners(AuditingEntityListener.class)
public class Repair extends Auditable<String>  implements Serializable {
	
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	 
	
	@OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.DETACH)
	@JoinColumn(name = "patient_id", nullable = true)
	private Patient patient;

	@Column(name="repair_problem")
	private String repairProblem;
	


	@OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	@JoinColumn(name = "repair_speaker_id", nullable = true)
	private RepairSpeaker repairSpeaker;

	@OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	@JoinColumn(name = "repair_productinfo_id", nullable = true)
	private RepairProductinfo repairProductinfo;

	
	 @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	 @JoinColumn(name = "repair_billing_address_id", nullable = true) 
	 private RepairAddress repairBillingAddress;
	 
	 @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	 @JoinColumn(name = "repair_shipping_address_id", nullable = true) 
	 private RepairAddress repairShippingAddress;
	 
	 @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	 @JoinColumn(name = "repair_status_id", nullable = true) 
	 private RepairStatus repairStatus;
	

	 
	
	@Column(name="order_id")
	private String orderId;
	
	@Column(name="order_date")
	private Date orderDate;
	
	@Column(name="hearing_aid_received_date")
	private Date hearingAidReceivedDate;
	
	@Column(name="received_by")
	private String receivedBy;
	
	@Column(name="accesories_kept_with_it")
	private String accesoriesKeptWithIt;
	
	@Column(name="repair_book_ready_by")
	private String repairBookReadyBy;
	
	@Column(name="approved_by")
	private String approvedBy;
	
	@Column(name="who_approved_the_estimate")
	private String whoApprovedTheEstimate;
	
	@Column(name="checking_hearing_aid_working")
	private String checkingHearingAidWorking;
	
	@Column(name="patient_to_received_the_hearing_aid_by")
	private String patientToReceivedTheHearingAidBy ;
	
	@Column(name="date_of_calling")
	private Date dateOfCalling;
	
	@Column(name="he_received_date_by_patient")
	private String heReceivedDateByPatient;
	
	@Column(name="ha_received_by")
	private String haReceivedBy;
	
	@Column(name="ha_given_to_pt_by_whom_clinic_staff")
	private String haGivenToPtByWhomClinicStaff;
	
	@Column(name="is_rushorder")
	private boolean isRushorder;
	
	@Column(name="description")
	private String description;
	
	@Column(name="remark")
	private String remark;

	@Column(name="sub_total")
	private double subTotal;
	
	@Column(name="discount")
	private double discount;
	
	@Column(name="grand_total")
	private double grandTotal;
	
	@Column(name="total_paid")
	private double totalPaid;
	
	@Column(name="pending_balance")
	private double pendingBalance;

	public Repair(RepairDto repairDto) {
		ObjectMapper mapper = new ObjectMapper();
		this.id = repairDto.getId();
		this.branch = new Branch(repairDto.getBranch());
		if(repairDto.getPatient().getId()!=null) {
			this.patient = new Patient(repairDto.getPatient(),true);
		}
		try {
			
			this.repairProblem = mapper.writeValueAsString(repairDto.getRepairProblem());
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.repairProductinfo= new RepairProductinfo(repairDto.getRepairProductinfoDto());
		this.repairSpeaker = new RepairSpeaker(repairDto.getRepairSpeakerDto());
	
		this.repairBillingAddress = new RepairAddress(repairDto.getRepairBillingAddress(),"billing");
		this.repairShippingAddress = new RepairAddress(repairDto.getRepairShippingAddress(),"shipping"); 
		this.repairStatus = new RepairStatus(repairDto.getRepairStatus());
		
		this.orderId = repairDto.getOrderId();
		this.orderDate = DateUtility.stringToDate(repairDto.getOrderDate());
		
		this.hearingAidReceivedDate = DateUtility.stringToDate(repairDto.getHearingAidReceivedDate());
		this.receivedBy = repairDto.getReceivedBy();
		this.accesoriesKeptWithIt = repairDto.getAccesoriesKeptWithIt();
		this.repairBookReadyBy = repairDto.getRepairBookReadyBy();
		this.approvedBy = repairDto.getApprovedBy();
		this.whoApprovedTheEstimate = repairDto.getWhoApprovedTheEstimate();
		this.checkingHearingAidWorking = repairDto.getCheckingHearingAidWorking();
		this.patientToReceivedTheHearingAidBy = repairDto.getPatientToReceivedTheHearingAidBy();
		this.dateOfCalling = DateUtility.stringToDate( repairDto.getDateOfCalling());
		this.heReceivedDateByPatient = repairDto.getHeReceivedDateByPatient();
		this.haReceivedBy = repairDto.getHaReceivedBy();
		this.haGivenToPtByWhomClinicStaff = repairDto.getHaGivenToPtByWhomClinicStaff();
		
		this.isRushorder = repairDto.isRushorder();
		this.description = repairDto.getDescription();
		this.remark = repairDto.getRemark();
		this.subTotal = repairDto.getSubTotal();
		this.discount = repairDto.getDiscount();
		this.grandTotal = repairDto.getGrandTotal();
		this.totalPaid = repairDto.getTotalPaid();
		this.pendingBalance = repairDto.getPendingBalance()	;
	
		
	}



	
}