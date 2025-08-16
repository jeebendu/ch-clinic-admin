package com.jee.clinichub.app.patient.schedule.service;

import java.util.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.diagnosis.model.Diagnosis;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosis;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosisDto;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.app.appointment.visitLabOrder.service.LabOrderServiceImpl;
import com.jee.clinichub.app.appointment.visitMedicines.model.Medicines;
import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.repository.DoctorRepository;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.invoice.service.InvoiceServiceImpl;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.patient.schedule.model.DoctorReferralDto;
import com.jee.clinichub.app.patient.schedule.model.DrReferalSearch;
import com.jee.clinichub.app.patient.schedule.model.ReferralCount;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleCountDTO;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;
import com.jee.clinichub.app.patient.schedule.model.SearchSchedule;
import com.jee.clinichub.app.patient.schedule.repository.ScheduleRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityManager;

@Service(value = "scheduleService")
public class ScheduleServiceImpl implements ScheduleService {

	private static final Logger log = LoggerFactory.getLogger(ScheduleServiceImpl.class);

	@Autowired
	private ScheduleRepository scheduleRepository;

	@Autowired
	EntityManager entityManager;

	@Autowired
	DoctorRepository doctorRepository;

	@Autowired
	private PatientRepository patientRepository;
	@Autowired
	private InvoiceServiceImpl invoiceServiceImpl;

	@Autowired
	private LabOrderServiceImpl lOrderServiceImpl;

	@Override
	public Status saveOrUpdate(ScheduleDto scheduleDto) {
		try {
			Schedule schedule = new Schedule();

			if (scheduleDto.getId() == null) {
				schedule = new Schedule(scheduleDto);
			} else {
				schedule = this.setSchedule(scheduleDto);
			}

			Optional<Doctor> doctor = doctorRepository.findById(scheduleDto.getConsultingDoctor().getId());
			if (doctor.isPresent()) {
				schedule.setConsultingDoctor(doctor.get());
			}

			Optional<Doctor> doctorOpt = doctorRepository.findById(scheduleDto.getReferByDoctor().getId());
			if (doctorOpt.isPresent()) {
				Doctor doctor1 = doctorOpt.get();
				schedule.setReferByDoctor(doctor1);
			}
			Optional<Patient> patientOpt = patientRepository.findById(scheduleDto.getPatient().getId());
			if (patientOpt.isPresent()) {
				Patient patient = patientOpt.get();

				Doctor doctor2 = schedule.getReferByDoctor();

				patient.setRefDoctor(doctor2);
				schedule.setPatient(patient);
				patientRepository.save(patient);
			}

			schedule = scheduleRepository.save(schedule);
			return new Status(true, ((scheduleDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}



	private Schedule setSchedule(ScheduleDto scheduleDto) {
    Schedule exSchedule = scheduleRepository.findById(scheduleDto.getId()).get();

    exSchedule.setComplaints(scheduleDto.getComplaints());
    exSchedule.setHistoryOf(scheduleDto.getHistoryOf());
    exSchedule.setRemark(scheduleDto.getRemark());
    exSchedule.setPostConsultationRemark(scheduleDto.getPostConsultationRemark());
    exSchedule.setNextFollowUpDate(scheduleDto.getNextFollowUpDate());
    exSchedule.setNotes(scheduleDto.getNotes());
    exSchedule.setAppointment(new Appointments(scheduleDto.getAppointment()));
    exSchedule.setReferByDoctor(new Doctor(scheduleDto.getReferByDoctor()));
    exSchedule.setConsultingDoctor(new Doctor(scheduleDto.getConsultingDoctor()));
    exSchedule.setPatient(new Patient(scheduleDto.getPatient()));
    exSchedule.setStatus(scheduleDto.getStatus());

    // === Medicines ===
    // List<Medicines> medicinesExist = exSchedule.getMedicines();
    // List<Long> dtoMedicineIds = scheduleDto.getMedicines().stream()
    //         .map(MedicinesDTO::getId)
    //         .collect(Collectors.toList());
    // medicinesExist.removeIf(existing -> !dtoMedicineIds.contains(existing.getId()));
    
	// scheduleDto.getMedicines().forEach(dto -> {
    //     Medicines medicine = medicinesExist.stream()
    //             .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
    //             .findFirst()
    //             .map(existing -> updateMedicine(existing, dto))
    //             .orElseGet(() -> createMedicines(dto, exSchedule));
       
	// 	if (!medicinesExist.contains(medicine)) {
    //         medicinesExist.add(medicine);
    //     }
    // });

    // // === Diagnosis ===
    // List<VisitDiagnosis> diagnosisExist = exSchedule.getDiagnosis();
    // List<Long> dtoDiagnosisIds = scheduleDto.getDiagnosis().stream()
    //         .map(VisitDiagnosisDto::getId)
    //         .collect(Collectors.toList());
    // diagnosisExist.removeIf(existing -> !dtoDiagnosisIds.contains(existing.getId()));
    // scheduleDto.getDiagnosis().forEach(dto -> {
    //     VisitDiagnosis diag = diagnosisExist.stream()
    //             .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
    //             .findFirst()
    //             .map(existing -> updateDiagnosis(existing, dto))
    //             .orElseGet(() -> createDiagnosis(dto, exSchedule));
    //     if (!diagnosisExist.contains(diag)) {
    //         diagnosisExist.add(diag);
    //     }
    // });

    // // === Invoices ===
    // List<Invoice> invoicesExist = exSchedule.getInvoices();
    // List<Long> dtoInvoiceIds = scheduleDto.getInvoices().stream()
    //         .map(InvoiceDTO::getId)
    //         .collect(Collectors.toList());
    // invoicesExist.removeIf(existing -> !dtoInvoiceIds.contains(existing.getId()));
    // scheduleDto.getInvoices().forEach(dto -> {
    //     Invoice invoice = invoicesExist.stream()
    //             .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
    //             .findFirst()
    //             .map(existing -> updateInvoice(existing, dto))
    //             .orElseGet(() -> createInvoice(dto, exSchedule));
    //     if (!invoicesExist.contains(invoice)) {
    //         invoicesExist.add(invoice);
    //     }
    // });

    // // === Lab Orders ===
    // List<LabOrder> labOrdersExist = exSchedule.getLaborders();
    // List<Long> dtoLabOrderIds = scheduleDto.getLaborders().stream()
    //         .map(LabOrderDTO::getId)
    //         .collect(Collectors.toList());
    // labOrdersExist.removeIf(existing -> !dtoLabOrderIds.contains(existing.getId()));
    // scheduleDto.getLaborders().forEach(dto -> {
    //     LabOrder labOrder = labOrdersExist.stream()
    //             .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
    //             .findFirst()
    //             .map(existing -> updateLabOrder(existing, dto))
    //             .orElseGet(() -> createLabOrder(dto, exSchedule));
    //     if (!labOrdersExist.contains(labOrder)) {
    //         labOrdersExist.add(labOrder);
    //     }
    // });

    return exSchedule;
}


public Medicines updateMedicine(Medicines medicine,MedicinesDTO dto){
medicine.setDosage(dto.getDosage());
medicine.setDuration(dto.getDuration());
medicine.setFrequency(dto.getFrequency());
medicine.setInstructions(dto.getInstruction());
medicine.setName(dto.getName());
medicine.setTimings(dto.getTimings());
	return medicine;
}

public Medicines createMedicines(MedicinesDTO medicinesDTO,Schedule schedule){
	Medicines medicines=new Medicines(medicinesDTO);
	medicines.setVisit(schedule);
	return medicines;
}

public VisitDiagnosis updateDiagnosis(VisitDiagnosis vDiagnosis,VisitDiagnosisDto dto){
		vDiagnosis.setDiagnosis(new Diagnosis(dto.getDiagnosis()));
		vDiagnosis.setDescription(dto.getDescription());
		vDiagnosis.setDiagnosedBy(dto.getDiagnosedBy());
		vDiagnosis.setPrimary(dto.isPrimary());
		vDiagnosis.setDiagnosisCode(dto.getDiagnosisCode());
		return vDiagnosis;
	}
	
	public VisitDiagnosis createDiagnosis(VisitDiagnosisDto vDto,Schedule schedule){
		VisitDiagnosis vDiagnosis=new VisitDiagnosis(vDto);
		vDiagnosis.setVisit(schedule);
		return vDiagnosis;
	}

	// invoice
	public Invoice updateInvoice(Invoice existingInvoice,InvoiceDTO dto){
		Invoice updateInvoice=invoiceServiceImpl.setInvoice(dto);
		return updateInvoice;
	}
	
	public Invoice createInvoice(InvoiceDTO iDto,Schedule schedule){
		Invoice vDiagnosis=new Invoice(iDto);
		vDiagnosis.setVisit(schedule);
		return vDiagnosis;
	}

		// LabOrder
		public LabOrder updateLabOrder(LabOrder existLab,LabOrderDTO labOrderDTO){
			LabOrder updatedOrder=lOrderServiceImpl.setLabOrder(labOrderDTO);
			return updatedOrder;
		}
		
		public LabOrder createLabOrder(LabOrderDTO iDto,Schedule schedule){
			LabOrder vDiagnosis=new LabOrder(iDto);
			vDiagnosis.setVisit(schedule);
			return vDiagnosis;
		}
		
		
	 @Override
	    public Page<ScheduleDto> getAllSchedulesPaginated(Pageable pageable, SearchSchedule search) {
	        try {
	            // Get current branch if branchId is not provided
	            
	                Branch currentBranch = BranchContextHolder.getCurrentBranch();
	                
	            // Extract search parameters
	            Long doctorId = (search != null) ? search.getRefDrId(): null;
	            String patientName = (search != null) ? null : null;

	            // Use repository method with filters
	            Page<Schedule> schedulePage = scheduleRepository.findSchedulesByBranchWithFilters(
	            		currentBranch.getId(), doctorId, patientName, pageable);

	            // Convert to DTO page
	            return schedulePage.map(ScheduleDto::new);

	        } catch (Exception e) {
	            log.error("Error fetching paginated schedules: {}", e.getLocalizedMessage());
	            throw new RuntimeException("Failed to fetch paginated schedules", e);
	        }
	    }

	@Override
	public List<ScheduleDto> getAllSchedules() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<Schedule> scheduleList = scheduleRepository.findAllByPatient_User_Branch_idOrderByIdDesc(branch.getId());
		List<ScheduleDto> scheduleDtoList = scheduleList.stream().map(ScheduleDto::new).collect(Collectors.toList());
		return scheduleDtoList;
	}

	@Override
	@Cacheable(value = "scheduleCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public ScheduleDto getById(Long id) {
		ScheduleDto scheduleDto = new ScheduleDto();
		try {
			Optional<Schedule> schedule = scheduleRepository.findById(id);
			if (schedule.isPresent()) {
				scheduleDto = new ScheduleDto(schedule.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return scheduleDto;
	}

	@Override
	@Cacheable(value = "scheduleCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public Schedule getScheduleById(Long id) {
		Schedule schedule = new Schedule();
		try {
			Optional<Schedule> _schedule = scheduleRepository.findById(id);
			if (_schedule.isPresent()) {
				schedule = _schedule.get();
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return schedule;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Schedule> schedule = scheduleRepository.findById(id);
			if (!schedule.isPresent()) {
				return new Status(false, "Schedule Not Found");
			}

			scheduleRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public List<ScheduleDto> getAllSchedulesByPID(Long pid) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<Schedule> scheduleList = scheduleRepository.findAllByPatient_id(pid);
		 List<ScheduleDto> scheduleDtoList = scheduleList.stream().map(ScheduleDto::new).collect(Collectors.toList());
		return scheduleDtoList;
	}

	@Override
	public List<Schedule> getAllScheduleByRefDtos(SearchSchedule search) {
		Branch branch = BranchContextHolder.getCurrentBranch();

		if (search.getFromDate() == null && search.getToDate() == null) {
			return scheduleRepository.findAllByReferByDoctor_idAndPatient_branch_id(search.getRefDrId(),
					branch.getId());
		} else if (search.getFromDate() == null) {
			search.setFromDate(new Date(0)); // Set to epoch start if fromDate is null
		} else if (search.getToDate() == null) {
			search.setToDate(new Date()); // Set to current date if toDate is null
		}

		Date adjustedFromDate = adjustDateToStartOfDay(search.getFromDate());
		Date adjustedToDate = adjustDateToEndOfDay(search.getToDate());

		return scheduleRepository.findAllByReferByDoctor_idAndPatient_branch_idAndCreatedTimeBetween(
				search.getRefDrId(), branch.getId(), adjustedFromDate, adjustedToDate);

	}

	private Date adjustDateToStartOfDay(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}

	private Date adjustDateToEndOfDay(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 999);
		return calendar.getTime();
	}

	@Override
	public List<DoctorReferralDto> countUniqueScheduleByDateAndRefDotor(DrReferalSearch search) {
		Branch branch = BranchContextHolder.getCurrentBranch();

		List<ScheduleCountDTO> scheduleList = scheduleRepository
				.countSchedulesByReferByDoctorAndUniqueDate(branch.getId(),search.getMonth(),search.getYear());

		Map<Doctor, List<ReferralCount>> groupedByDoctor = scheduleList.stream()
				.collect(Collectors.groupingBy(
						row -> row.getRefDoctor(),
						Collectors.mapping(row -> new ReferralCount(row.getCreatedTime(), row.getNumberOfSchedules()),
								Collectors.toList())));

		Set<Doctor> doctors = groupedByDoctor.keySet();

		List<DoctorReferralDto> doctorReferralDtos = doctors.stream()
				.map(doctor -> new DoctorReferralDto(doctor, groupedByDoctor.getOrDefault(doctor, List.of())))
				.collect(Collectors.toList());

		return doctorReferralDtos;
	}
}