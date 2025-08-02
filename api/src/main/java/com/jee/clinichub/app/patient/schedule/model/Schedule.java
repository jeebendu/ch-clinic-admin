package com.jee.clinichub.app.patient.schedule.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosis;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.app.appointment.visitMedicines.model.Medicines;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

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
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "patient_schedule")
@EntityListeners(AuditingEntityListener.class)
@ToString
@EqualsAndHashCode(callSuper = false, exclude = {"medicines", "diagnosis", "invoices", "laborders"})
public class Schedule extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "patient_id", nullable = false)
	private Patient patient;

	@OneToOne
	@JoinColumn(name = "consulting_doctor_id", nullable = true)
	private Doctor consultingDoctor;

	@Column(name = "complaints")
	private String complaints;

	@Column(name = "history_of")
	private String historyOf;

	@Column(name = "remark")
	private String remark;

	@Column(name = "post_consultation_remark")
	private String postConsultationRemark;

	@Column(name = "next_follow_up_date")
	private String nextFollowUpDate;

	@OneToOne
	@JoinColumn(name = "refer_by_doctor_id", nullable = true)
	private Doctor referByDoctor;

	@OneToOne
	@JoinColumn(name = "appointment_id", nullable = true)
	private Appointments appointment;

	private String notes;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private VisitStatus status;

	@OneToOne
	@JoinColumn(name="branch_id")
	private Branch branch;

	// *****************************
	@JsonManagedReference
	@OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	List<Medicines> medicines = new ArrayList<Medicines>();

	@JsonManagedReference
	@OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	List<VisitDiagnosis> diagnosis = new ArrayList<VisitDiagnosis>();

	@JsonManagedReference
	@OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	List<Invoice> invoices = new ArrayList<Invoice>();

	@JsonManagedReference
	@OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	List<LabOrder> laborders = new ArrayList<LabOrder>();

	public Schedule(ScheduleDto scheduleDto) {
		// super();
		this.id = scheduleDto.getId();
		this.patient = new Patient(scheduleDto.getPatient());
		this.consultingDoctor = new Doctor(scheduleDto.getConsultingDoctor());
		this.complaints = scheduleDto.getComplaints();
		this.historyOf = scheduleDto.getHistoryOf();
		this.remark = scheduleDto.getRemark();
		this.postConsultationRemark = scheduleDto.getPostConsultationRemark();
		this.nextFollowUpDate = scheduleDto.getNextFollowUpDate();
		this.referByDoctor = new Doctor(scheduleDto.getReferByDoctor());
		this.appointment = new Appointments(scheduleDto.getAppointment());
		this.notes = scheduleDto.getNotes();
		this.status = scheduleDto.getStatus();

		this.branch=new Branch(scheduleDto.getBranch());
		// For medicines
		scheduleDto.getMedicines().forEach(item -> {
			Medicines medicinesObj = new Medicines(item);
			medicinesObj.setVisit(this);
			this.medicines.add(medicinesObj);
		});

		// For diagnosis
		scheduleDto.getDiagnosis().forEach(item -> {
			VisitDiagnosis diagnosisObj = new VisitDiagnosis(item);
			diagnosisObj.setVisit(this);
			this.diagnosis.add(diagnosisObj);
		});

		// For invoices
		scheduleDto.getInvoices().forEach(item -> {
			Invoice invoiceObj = new Invoice(item);
			invoiceObj.setVisit(this);
			this.invoices.add(invoiceObj);
		});

		// For lab orders
		scheduleDto.getLaborders().forEach(item -> {
			LabOrder labOrderObj = new LabOrder(item);
			labOrderObj.setVisit(this);
			this.laborders.add(labOrderObj);
		});

	}

}