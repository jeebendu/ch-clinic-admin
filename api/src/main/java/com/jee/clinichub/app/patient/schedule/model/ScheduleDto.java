package com.jee.clinichub.app.patient.schedule.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosisDto;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.sales.order.model.SalesOrderItemDto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleDto {

	private Long id;

	private PatientDto patient;

	private DoctorDto consultingDoctor;

	private String complaints;

	private String historyOf;

	private String remark;
	private DoctorDto referByDoctor;
	private String nextFollowUpDate;
	private String postConsultationRemark;
	private Date createdTime;
	private AppointmentsDto appointment;

	private String notes;
	@Enumerated(EnumType.STRING)
	private VisitStatus status;
	// ****************

	private BranchDto branch;
	List<MedicinesDTO> medicines = new ArrayList<MedicinesDTO>();
	List<VisitDiagnosisDto> diagnosis = new ArrayList<VisitDiagnosisDto>();
	List<InvoiceDTO> invoices = new ArrayList<InvoiceDTO>();
	List<LabOrderDTO> laborders = new ArrayList<LabOrderDTO>();

	public ScheduleDto(Schedule schedule) {
		this.id = schedule.getId();
		this.createdTime = schedule.getCreatedTime();
		this.patient = new PatientDto(schedule.getPatient());
		this.consultingDoctor = new DoctorDto(schedule.getConsultingDoctor());
		this.complaints = schedule.getComplaints();
		this.historyOf = schedule.getHistoryOf();
		this.remark = schedule.getRemark();
		this.postConsultationRemark = schedule.getPostConsultationRemark();
		this.nextFollowUpDate = schedule.getNextFollowUpDate();
		this.referByDoctor = new DoctorDto(schedule.getReferByDoctor());
		this.appointment = new AppointmentsDto(schedule.getAppointment());
		this.notes = schedule.getNotes();
		this.status = schedule.getStatus();

		this.branch=new BranchDto(schedule.getBranch());
		// For medicines
		schedule.getMedicines().forEach(item -> {
			this.medicines.add(new MedicinesDTO(item));
		});

		// For diagnosis
		schedule.getDiagnosis().forEach(item->{
			this.diagnosis.add(new VisitDiagnosisDto(item));
		});
		// For invoices
		schedule.getInvoices().forEach(item -> {
			this.invoices.add(new InvoiceDTO(item));
		});

		// For lab orders
		schedule.getLaborders().forEach(item -> {
			this.laborders.add(new LabOrderDTO(item));
		});

	}

}