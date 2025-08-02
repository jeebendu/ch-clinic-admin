package com.jee.clinichub.app.repair.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.BranchDto;

import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemDataDto;
import com.jee.clinichub.global.model.DataMap;
import com.jee.clinichub.global.utility.DateUtility;

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
public class RepairDto {
    
	
    private Long id;
	private String orderId;
	private String orderDate;
	private RepairProblemDataDto[] repairProblem;
	private String hearingAidReceivedDate;
	private String receivedBy;
	private String accesoriesKeptWithIt;
	private String repairBookReadyBy;
	private String approvedBy;
	private String whoApprovedTheEstimate;
	private String checkingHearingAidWorking;
	private String patientToReceivedTheHearingAidBy ;
	private String dateOfCalling;
	private String heReceivedDateByPatient;
	private String haReceivedBy;
	private String haGivenToPtByWhomClinicStaff;
	
	private boolean isRushorder;
	private String description;
	private String remark;
	private double subTotal;
	private double discount;
	private double grandTotal;
	private double totalPaid;
	private double pendingBalance;
	
	private BranchDto branch;
	private PatientDto patient;
	private RepairConditionDto repairConditionDto;
	private RepairProductinfoDto repairProductinfoDto;
	private RepairSpeakerDto repairSpeakerDto;
	private RepairDefectDto  repairDefectDto;
	private RepairFitDto  repairFitDto;
	private RepairResponseDto repairResponseDto;
	private RepairStatusDto repairStatus;
	
	
	private RepairAddressDto repairBillingAddress;
	private RepairAddressDto repairShippingAddress;
	private List<RepairPaymentDto> repairPaymentList = new ArrayList<RepairPaymentDto>();
	private List<RepairCourierDto> repairCourierList = new ArrayList<RepairCourierDto>();

	

	
	public RepairDto(Repair repair) {
		ObjectMapper om = new ObjectMapper();
		this.id = repair.getId();
		this.branch = new BranchDto(repair.getBranch());
		if(repair.getPatient()!=null) {
			this.patient = new PatientDto(repair.getPatient());
		}
		try {
			this.repairProblem = om.readValue(repair.getRepairProblem(), RepairProblemDataDto[].class);
			
		}
		catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.repairProductinfoDto = new RepairProductinfoDto(repair.getRepairProductinfo());
		this.repairSpeakerDto = new RepairSpeakerDto(repair.getRepairSpeaker());
		
		this.repairBillingAddress = new RepairAddressDto(repair.getRepairBillingAddress());
		this.repairShippingAddress = new RepairAddressDto(repair.getRepairShippingAddress()); 
		this.repairStatus = new RepairStatusDto(repair.getRepairStatus()); 
		this.orderId = repair.getOrderId();
		
		
		this.orderDate = DateUtility.dateToString(repair.getOrderDate());
		
		this.hearingAidReceivedDate = DateUtility.dateToString(repair.getHearingAidReceivedDate());
		this.receivedBy = repair.getReceivedBy();
		this.accesoriesKeptWithIt = repair.getAccesoriesKeptWithIt();
		this.repairBookReadyBy = repair.getRepairBookReadyBy();
		this.approvedBy = repair.getApprovedBy();
		this.whoApprovedTheEstimate = repair.getWhoApprovedTheEstimate();
		this.checkingHearingAidWorking = repair.getCheckingHearingAidWorking();
		this.patientToReceivedTheHearingAidBy = repair.getPatientToReceivedTheHearingAidBy();
		this.dateOfCalling = DateUtility.dateToString( repair.getDateOfCalling());
		this.heReceivedDateByPatient = repair.getHeReceivedDateByPatient();
		this.haReceivedBy = repair.getHaReceivedBy();
		this.haGivenToPtByWhomClinicStaff = repair.getHaGivenToPtByWhomClinicStaff();
		
		this.isRushorder = repair.isRushorder();
		this.description = repair.getDescription();
		this.remark = repair.getRemark();
		
		this.subTotal = repair.getSubTotal();
		this.discount = repair.getDiscount();
		this.grandTotal = repair.getGrandTotal();
		this.totalPaid = repair.getTotalPaid();
		//this.paidAmount = repair.getPaidAmount();
		
		
		this.pendingBalance= repair.getPendingBalance();
	
		
	}
	

    
    
}