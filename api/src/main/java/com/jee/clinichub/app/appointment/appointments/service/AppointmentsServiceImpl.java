package com.jee.clinichub.app.appointment.appointments.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.layout.font.FontProvider;
import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.appointment.appointments.event.AppointmentBookedEvent;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentFilter;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentSearch;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsProj;
import com.jee.clinichub.app.appointment.appointments.model.StatusUpdate;
import com.jee.clinichub.app.appointment.appointments.repository.AppointmentsRepo;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.model.Sequence;
import com.jee.clinichub.app.core.sequence.repository.SequenceRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.core.sync.SyncOrchestratorService;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.model.SlotUtils;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.utility.TypeConverter;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class AppointmentsServiceImpl implements AppointmentsService {

	@Value("${mail.from}")
	private String fromEmail;

	@Value("${app.default-tenant}")
	private String defaultTenant;

	private final AppointmentsRepo appointmentsRepo;
	private final ModuleRepository moduleRepository;
	private final PatientRepository patientRepository;
	private final SequenceService sequenceService;
	private final SequenceRepository sequenceRepository;
	private final DoctorBranchRepo doctorBranchRepo;
	private final SlotRepo slotRepo;
	private final ClinicMasterRepository clinicMasterRepository;
	private final TypeConverter typeConverter;
	private final SyncOrchestratorService syncOrchestratorService;

	private final AppointmentSyncService appointmentSyncService;
	private final AppointmentNotificationService appointmentNotificationService;

	@PersistenceContext
	private EntityManager entityManager;

	private final ApplicationEventPublisher applicationEventPublisher;

	@Override
	public List<AppointmentsDto> getAllAppointments() {
		return appointmentsRepo.findAll().stream().map(AppointmentsDto::new).toList();

	}

	@Override
	public AppointmentsDto getById(Long id) {
		return appointmentsRepo.findById(id).map(AppointmentsDto::new).orElseThrow(() -> {
			throw new EntityNotFoundException("Appointment not found with id : " + id);
		});
	}

	@Override
	public Status deleteById(Long id) {
		appointmentsRepo.findById(id).ifPresentOrElse((data) -> {
			appointmentsRepo.deleteById(id);
		}, () -> {
			throw new EntityNotFoundException("Appointment not found with id : " + id);
		});
		return new Status(true, "Appointment Deleted Successfully");
	}

	@Override
	@Transactional
	public Appointments saveOrUpdate(AppointmentsDto appointmentDto) {
		try {

			boolean isTodayAppointment = false;

			if (appointmentDto.getFamilyMember() == null || appointmentDto.getFamilyMember().getId() == null) {
				isTodayAppointment = appointmentsRepo.existsByPatient_idAndDoctorBranch_idAndSlot_date(
						appointmentDto.getPatient().getId(),
						appointmentDto.getDoctorBranch().getId(),
						appointmentDto.getSlot().getDate());
			} else {
				isTodayAppointment = appointmentsRepo
						.existsByPatient_idAndFamilyMember_idAndDoctorBranch_idAndSlot_date(
								appointmentDto.getPatient().getId(),
								appointmentDto.getFamilyMember().getId(),
								appointmentDto.getDoctorBranch().getId(),
								appointmentDto.getSlot().getDate());

			}

			if (isTodayAppointment) {
				throw new Exception("You have already create a appointment for this you/family member");
			}

			Module module = moduleRepository.findByName(ModuleEnum.appointment.toString());
			if (module == null) {
				return null;
				// return new Status(false, "1005 : Contact Admin for Sequense");
			}
			String nextSequense = null;
			Appointments appointments = new Appointments();

			if (appointmentDto.getId() == null) {

				// New appointment - ensure globalAppointmentId is set
				if (appointmentDto.getGlobalAppointmentId() == null) {
					appointmentDto.setGlobalAppointmentId(UUID.randomUUID());
				}

				Patient patient = patientRepository.findById(appointmentDto.getPatient().getId())
						.orElseThrow(() -> new EntityNotFoundException("Patient not found "));

				if (patient.getGlobalPatientId() == null) {
					patient.setGlobalPatientId(UUID.randomUUID());
					appointmentDto.setPatient(patient);
					patientRepository.save(patient);
				}

				Slot slot = slotRepo.findById(appointmentDto.getSlot().getId())
						.orElseThrow(() -> new EntityNotFoundException("Slot not found "));

				DoctorBranch doctorBranch = doctorBranchRepo.findById(appointmentDto.getDoctorBranch().getId()).get();

				if (doctorBranch == null) {
					return null;
					// return new Status(false, "Something went wrong");
				}
				boolean isSequenseExists = sequenceRepository.existsByBranch_idAndModule_id(
						slot.getDoctorBranch().getBranch().getId(),
						module.getId());
				if (!isSequenseExists) {
					Sequence sequence = new Sequence();
					sequence.setIncludeYear(false);
					sequence.setIncrementPadChar('0');
					sequence.setIncrementPadLength(4);
					sequence.setIncrementLastId(0);
					sequence.setIncrementPrefix("Appt-");
					sequence.setBranch(slot.getDoctorBranch().getBranch());
					sequence.setModule(module);
					sequenceRepository.save(sequence);
				}

				nextSequense = sequenceService.getNextSequense(slot.getDoctorBranch().getBranch().getId(),
						module.getId());

				appointments.setDoctorBranch(doctorBranch);
				appointments.setPatient(patient);
				appointments.setStatus(AppointmentStatus.UPCOMING);
				appointments.setSlot(slot);
				appointments.setFamilyMember(appointmentDto.getFamilyMember());
				appointments.setBookingId(nextSequense);
				LocalTime expectedAppointment = SlotUtils.getExpectedAppointmentTime(slot);

				if (slot.getSlotType().equals(SlotType.COUNTWISE)) {
					appointments.setExpectedTime(expectedAppointment);
				} else {
					appointments.setExpectedTime(slot.getStartTime());
				}

			} else {
				appointments = this.setAppointments(appointmentDto);
				// appointments = entityManager.merge(appointments);
			}

			Slot slot = slotRepo.findById(appointments.getSlot().getId())
					.orElseThrow(() -> new EntityNotFoundException("Slot not found "));

			if (slot.getAvailableSlots() <= 0) {
				return null;
			} else {
				slot.setAvailableSlots(slot.getAvailableSlots() - 1);
				slot = slotRepo.save(slot);
			}

			Appointments savAppointments = appointmentsRepo.save(appointments);

			if (appointmentDto.getId() == null) {
				boolean status = sequenceService.incrementSequense(slot.getDoctorBranch().getBranch().getId(),
						module.getId(), nextSequense);

				// Publish event for new appointments to send Email via
				// AppointmentBookedEventListener
				AppointmentBookedEvent event = new AppointmentBookedEvent(this, savAppointments);
				applicationEventPublisher.publishEvent(event);
			}

			String currentTenant = TenantContextHolder.getCurrentTenant();

			Clinic clinic = savAppointments.getDoctorBranch().getBranch().getClinic();

			if (defaultTenant.equals(currentTenant)) {

				Optional<ClinicMaster> clinicMaster = clinicMasterRepository.findById(clinic.getId());

				if (clinicMaster.isPresent()) {
					Tenant tenant = clinicMaster.get().getTenant();
					TenantContextHolder.setCurrentTenant(tenant.getClientId());

					// Use enhanced sync with error handling
					boolean syncSuccess = syncOrchestratorService.syncAppointmentWithErrorHandling(
							new AppointmentsDto(savAppointments), tenant.getClientId());

					if (!syncSuccess) {
						log.warn("Appointment sync failed but appointment was saved locally. GlobalAppointmentId: {}",
								savAppointments.getGlobalAppointmentId());
						// Continue execution - sync will be retried asynchronously
					}
				} else {
					log.error("ClinicMaster not found for clinic ID: {}", clinic.getId());
				}
			} else {
				boolean syncSuccess = syncOrchestratorService.syncAppointmentWithErrorHandling(
						new AppointmentsDto(savAppointments), "master");
			}

			return savAppointments;

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			throw new RuntimeException(e.getMessage());
			// return new Status(false, "Something went wrong");
		}

	}

	@Override
	public void sendAppointmentConfirmEmail(Appointments appointment, byte[] pdfData) {
		appointmentNotificationService.sendAppointmentConfirmEmail(appointment, pdfData);
	}

	
	

	/**
	 * Send WhatsApp message with PDF attachment and location
	 */
	private void sendWhatsAppWithPdfAndLocation(Appointments appointment, byte[] pdfData) {
		appointmentNotificationService.sendWhatsAppWithPdfAndLocation(appointment, pdfData);
	}



	private Appointments setAppointments(AppointmentsDto appointmentsDto) {
		Appointments exAppoinrment = appointmentsRepo.findById(appointmentsDto.getId()).get();

		// exAppoinrment.setDoctorBranch(new
		// DoctorBranch(appointmentsDto.getDoctorBranch()));
		exAppoinrment.setPatient(appointmentsDto.getPatient());
		exAppoinrment.setStatus(appointmentsDto.getStatus());
		exAppoinrment.setFamilyMember(appointmentsDto.getFamilyMember());
		exAppoinrment.setExpectedTime(appointmentsDto.getExpectedTime());
		// exAppoinrment.setVisitType(appointmentsDto.getVisitType());
		exAppoinrment.setSlot(appointmentsDto.getSlot());
		return exAppoinrment;

	}

	@Override
	public Status updateStatus(Long id, StatusUpdate status) {
		try {
			appointmentsRepo.findById(id).ifPresentOrElse(appointment -> {
				appointment.setStatus(status.getStatus());
				appointmentsRepo.save(appointment);
			}, () -> {
				try {
					throw new Exception("Appointment Request not found");
				} catch (Exception e) {
					e.printStackTrace();
				}
			});
			return new Status(true, "Status updated to " + status.toString());
		} catch (Exception e) {
			return new Status(true, "Something went wrong");
		}
	}

	@Override
	public Page<AppointmentsProj> search(AppointmentSearch search, int pageNo,
			int pageSize) {
		Page<AppointmentsProj> result = Page.empty();
		try {
			Pageable pr = PageRequest.of(pageNo, pageSize);

			AppointmentStatus status = search.getStatus();
			List<Long> doctors = (search.getDoctors() != null && search.getDoctors().size() > 0) ? search.getDoctors()
					: null;

			String type = search.getType() != null ? search.getType() : null;
			String value = search.getValue() != null ? search.getValue() : null;

			Date date = search.getDate() == null ? null : search.getDate();
			if (date == null) {
				result = appointmentsRepo.getAppointmentFilterData(pr, status, doctors, type, value);
			} else {
				result = appointmentsRepo.findAllBySlot_dateGreaterThanEqual(pr, search.getDate());
			}

		} catch (Exception e) {
			log.error("Something went wrong ! :)" + e.getLocalizedMessage());
		}
		return result;

	}

	@Override
	public List<AppointmentsProj> getAppointmentsForPatient(String name, Date currentTime) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Patient patient = patientRepository.findWithBranchByUser_username(authentication.getName()).get();
		Long patientId = patient.getId();
		return appointmentsRepo.findAppointmentsByType(name, patientId, currentTime);
	}

	@Override
	public Page<AppointmentsProj> getAppointmentsByDrID(Pageable pageable, Long id, AppointmentFilter filter) {
		try {
			List<Long> branches = filter.getBranches().size() > 0 ? filter.getBranches() : null;
			List<AppointmentStatus> statuses = filter.getStatuses().size() > 0 ? filter.getStatuses() : null;
			String searchTerm = (filter.getSearchTerm() != null && filter.getSearchTerm() != "")
					? filter.getSearchTerm()
					: "";

			return appointmentsRepo.findAppointmentsByDrId(pageable, id, branches, statuses, searchTerm);
		} catch (Exception e) {
			throw new RuntimeException("Error fetching appointments for doctor with id: " + id);
		}
	}

	@Override
	public Page<Patient> patientListByDrId(Pageable pageable, Long drId, AppointmentFilter filter) {
		try {

			List<Long> branches = filter.getBranches() != null
					? (filter.getBranches().size() > 0 ? filter.getBranches() : null)
					: null;
			String searchTerm = (filter.getSearchTerm() != null && filter.getSearchTerm() != "")
					? filter.getSearchTerm()
					: "";
			List<String> gender = filter.getGender() != null
					? (filter.getGender().size() > 0 ? filter.getGender() : null)
					: null;
			return appointmentsRepo.findUniquePatientsByDrId(pageable, drId, branches, searchTerm, gender);

		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public Status updateStatusToCancelled(AppointmentsDto appointmentsDto) {
		Long id = appointmentsDto.getId();
		try {

			Appointments appointment = appointmentsRepo.findById(id)
					.orElseThrow(() -> new EntityNotFoundException("Appointment not found with id : " + id));

			if (appointment != null && appointment.getStatus() == AppointmentStatus.UPCOMING) {
				Slot slot = appointment.getSlot();
				if (slot != null) {
					slot.setAvailableSlots(slot.getAvailableSlots() + 1);
					slotRepo.save(slot);
				}
				// Update appointment status to CANCELLED
				appointment.setStatus(AppointmentStatus.CANCELLED);
				appointment.setCancelReason(appointmentsDto.getCancelReason());
				// Save the updated appointment
				appointmentsRepo.save(appointment);

				Clinic clinic = appointment.getDoctorBranch().getBranch().getClinic();
				Optional<ClinicMaster> clinicMaster = clinicMasterRepository.findById(clinic.getId());

				if (clinicMaster.isPresent()) {
					Tenant tenant = clinicMaster.get().getTenant();
					TenantContextHolder.setCurrentTenant(tenant.getClientId());
					appointmentSyncService.syncCancelAppointment(
							new AppointmentsDto(appointment), tenant.getClientId());
				} else {
					log.error("ClinicMaster not found for clinic ID: {}", clinic.getId());
					return new Status(false, "ClinicMaster not found for clinic ID:" + clinic.getId());
				}

			} else {
				return new Status(false, "Appointment not found or status is not UPCOMING");

			}
			return new Status(true, "Status updated to CANCELLED");
		} catch (Exception e) {
			return new Status(false, "Something went wrong while Cancell Appointment");
		}
	}

	@Override
	public Status checkedInAppointment(Long id) {
		try {
			Appointments appointment = appointmentsRepo.findById(id)
					.orElseThrow(() -> new EntityNotFoundException("Appointment not found with id : " + id));

			if (appointment != null && appointment.getStatus() == AppointmentStatus.UPCOMING) {

				appointment.setStatus(AppointmentStatus.CHECKEDIN);
			} else {
				return new Status(false, "Invalid Appointment ");

			}
			appointmentsRepo.save(appointment);
			return new Status(true, "Status updated to CHECKEDIN");

		} catch (Exception e) {
			log.error("Falid to Update Appointment ", e);
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public Page<AppointmentsProj> appointmentForClinicBranch(Pageable pageable, AppointmentFilter filter) {
		Page<AppointmentsProj> res = Page.empty();
		try {
			List<Long> branches = new ArrayList<>();
			Branch branch = BranchContextHolder.getCurrentBranch();
			if (branch != null && branch.getId() != null && filter.getBranches().size() <= 0) {
				branches.add(branch.getId());
			}
			branches = filter.getBranches().size() > 0 ? filter.getBranches() : null;
			List<AppointmentStatus> statuses = filter.getStatuses().size() > 0 ? filter.getStatuses() : null;
			String searchTerm = (filter.getSearchTerm() != null && filter.getSearchTerm() != "")
					? filter.getSearchTerm()
					: "";

			res = appointmentsRepo.appointmentForClinicBranch(pageable, branches, statuses, searchTerm);

		} catch (Exception e) {

			log.error(e.getLocalizedMessage());
		}
		return res;
	} 

	@Override
	public byte[] downloadAppointment(Long id) {
	    log.info("Generating appointment PDF for ID: {}", id);

	    try {
	        Appointments appointment = appointmentsRepo.findById(id)
	                .orElseThrow(() -> {
	                    log.warn("Appointment not found with id: {}", id);
	                    return new EntityNotFoundException("Appointment not found with id: " + id);
	                });

	        log.debug("Appointment data loaded successfully for ID: {}", id);

	        String html = appointmentNotificationService.generateAppointmentHtml(appointment);
	        log.debug("Generated HTML content for appointment ID: {}", id);

	        FontProvider fontProvider = new FontProvider();

	        try {
	            log.debug("Attempting to load custom font from classpath: fonts/OpenSans/OpenSans-Regular.ttf");

	            ClassPathResource fontResource = new ClassPathResource("fonts/OpenSans/OpenSans-Regular.ttf");
	            InputStream fontInputStream = fontResource.getInputStream();

	            File tempFont = File.createTempFile("opensans", ".ttf");
	            tempFont.deleteOnExit();

	            try (FileOutputStream fos = new FileOutputStream(tempFont)) {
	                fontInputStream.transferTo(fos);
	            }

	            fontProvider.addFont(tempFont.getAbsolutePath());
	            fontInputStream.close();

	            log.info("Custom font loaded and registered successfully: {}", tempFont.getAbsolutePath());

	        } catch (Exception fontException) {
	            log.warn("Failed to load custom font, falling back to system fonts: {}", fontException.getMessage());
	        }

	        ConverterProperties properties = new ConverterProperties();
	        properties.setFontProvider(fontProvider);
	        properties.setCharset("UTF-8");

	        ByteArrayOutputStream baos = new ByteArrayOutputStream();
	        HtmlConverter.convertToPdf(html, baos, properties);

	        log.info("PDF generated successfully for appointment ID: {}", id);
	        return baos.toByteArray();

	    } catch (Exception e) {
	        log.error("PDF generation failed for appointment ID {}: {}", id, e.getMessage(), e);
	        return null;
	    }
	}

	

	@Override
	public Page<AppointmentsProj> filterPatientAppointment(Pageable pageble, Date currentDate) {
		Page<AppointmentsProj> result = Page.empty();
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Patient patient = patientRepository.findWithBranchByUser_username(authentication.getName()).get();
			Long patientId = patient.getId();
			result = appointmentsRepo.filterPatientAppointment(pageble, AppointmentStatus.UPCOMING, patientId);

		} catch (Exception e) {
			// TODO: handle exception
		}
		return result;
	}

	@Override
	public boolean ispatientTakenService(Long doctorId, Long patientId) {
		try {
			boolean isServiceTaken = appointmentsRepo.existsByPatient_idAndDoctorBranch_doctor_idAndStatus(patientId,
					doctorId, AppointmentStatus.COMPLETED);
			return isServiceTaken;
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public Status isTakenTodayAppointment(AppointmentsDto appointmentsDto) {
		try {
			boolean isTodayAppointment = false;
			if (appointmentsDto.getFamilyMember() == null || appointmentsDto.getFamilyMember().getId() == null) {

				isTodayAppointment = appointmentsRepo.existsByPatient_idAndDoctorBranch_idAndSlot_date(
						appointmentsDto.getPatient().getId(),
						appointmentsDto.getDoctorBranch().getId(),
						appointmentsDto.getSlot().getDate());
				if (isTodayAppointment) {
					return new Status(false, "Hey " + appointmentsDto.getPatient().getFirstname()
							+ " You have already booked an appointment today for you");
				}

			} else {
				isTodayAppointment = appointmentsRepo
						.existsByPatient_idAndFamilyMember_idAndDoctorBranch_idAndSlot_date(
								appointmentsDto.getPatient().getId(),
								appointmentsDto.getFamilyMember().getId(),
								appointmentsDto.getDoctorBranch().getId(),
								appointmentsDto.getSlot().getDate());

				if (isTodayAppointment) {
					return new Status(false, "Hey " + appointmentsDto.getPatient().getFirstname()
							+ " You have already booked an appointment today for "
							+ appointmentsDto.getFamilyMember().getName());
				}

			}
			return new Status(true, "You can book appointment for today");

		} catch (Exception e) {
			return new Status(true, "You can book appointment for today");
		}
	}

	@Override
	public Appointments rescheduleAppointment(AppointmentsDto appointmentsDto) {
		Long id = appointmentsDto.getId();
		try {
			if (id == null) {
				throw new RuntimeException("Appointment ID is required for rescheduling");
			}
			Appointments appointment = appointmentsRepo.findById(id)
					.orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));
			if (appointment.getStatus() != AppointmentStatus.UPCOMING) {
				throw new RuntimeException("Appointment cannot be rescheduled as it is not in UPCOMING status");
			}

			Slot previousSlot = slotRepo.findById(appointment.getSlot().getId())
					.orElseThrow(() -> new EntityNotFoundException(
							"Slot not found with id: " + appointment.getSlot().getId()));
			previousSlot.setStatus(SlotStatus.AVAILABLE);
			previousSlot.setAvailableSlots(previousSlot.getAvailableSlots() + 1);
			slotRepo.save(previousSlot);

			Slot currentSlot = slotRepo.findById(appointmentsDto.getSlot().getId())
					.orElseThrow(() -> new EntityNotFoundException(
							"Slot not found with id: " + appointmentsDto.getSlot().getId()));
			currentSlot.setAvailableSlots(currentSlot.getAvailableSlots() - 1);
			if (currentSlot.getAvailableSlots() <= 0) {
				currentSlot.setStatus(SlotStatus.BOOKED);
			}
			slotRepo.save(currentSlot);

			appointment.setStatus(AppointmentStatus.UPCOMING);
			appointment.setSlot(currentSlot);
			LocalTime expectedAppointment = SlotUtils.getExpectedAppointmentTime(currentSlot);

			if (currentSlot.getSlotType().equals(SlotType.COUNTWISE)) {
				appointment.setExpectedTime(expectedAppointment);
			} else {
				appointment.setExpectedTime(currentSlot.getStartTime());
			}

			Appointments updatedAppointment = appointmentsRepo.save(appointment);

			if (appointmentsDto.getId() != null) {
				AppointmentBookedEvent event = new AppointmentBookedEvent(this, updatedAppointment);
				applicationEventPublisher.publishEvent(event);
			}

			SlotDto savedCurrentslot = new SlotDto(currentSlot);
			AppointmentsDto updatedAppointmentDto = new AppointmentsDto(updatedAppointment);
			updatedAppointmentDto.setSlot(new Slot(savedCurrentslot));
			updatedAppointmentDto.getSlot().setAvailableSlots(updatedAppointmentDto.getSlot().getAvailableSlots() + 1);

			Clinic clinic = updatedAppointment.getDoctorBranch().getBranch().getClinic();
			Optional<ClinicMaster> clinicMaster = clinicMasterRepository.findById(clinic.getId());

			if (clinicMaster.isPresent()) {
				Tenant tenant = clinicMaster.get().getTenant();
				TenantContextHolder.setCurrentTenant(tenant.getClientId());
				boolean syncSuccess = syncOrchestratorService.syncAppointmentWithErrorHandling(
						updatedAppointmentDto, tenant.getClientId());

				if (!syncSuccess) {
					log.warn("Appointment sync failed but appointment was saved locally. GlobalAppointmentId: {}",
							updatedAppointment.getGlobalAppointmentId());
				}
			} else {
				log.error("ClinicMaster not found for clinic ID: {}", clinic.getId());
			}
			return updatedAppointment;
		} catch (Exception e) {
			log.error("Error rescheduling appointment with id: " + id, e);
			throw new RuntimeException("Error rescheduling appointment: " + e.getMessage());
		}
	}

	@Override
	public List<DoctorDto> findAllDoctorList() {
		try {
			return appointmentsRepo.findDoctorsFromAppointment().stream().map(DoctorDto::new).toList();
		} catch (Exception e) {
			return null;
		}
	}

}