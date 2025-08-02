package com.jee.clinichub.app.appointment.requests.service;

import java.util.List;
import java.util.Optional;

import javax.sound.midi.InvalidMidiDataException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.repository.AppointmentsRepo;
import com.jee.clinichub.app.appointment.appointments.service.AppointmentsServiceImpl;
import com.jee.clinichub.app.appointment.requests.model.Request;
import com.jee.clinichub.app.appointment.requests.model.RequestDto;
import com.jee.clinichub.app.appointment.requests.model.RequestProj;
import com.jee.clinichub.app.appointment.requests.model.RequestSearch;
import com.jee.clinichub.app.appointment.requests.model.StatusDto;
import com.jee.clinichub.app.appointment.requests.repository.RequestRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.app.user.role.repository.RoleeRepository;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.Status;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "requestService")
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

	private final RequestRepository requestRepository;

	private final AppointmentsServiceImpl appointmentsServiceImpl;

	private final AppointmentsRepo appointmentsRepository;

	private final BranchRepository branchRepository;

	private final UserRepository userRepository;
	private final ModuleRepository moduleRepository;
	private final SequenceService sequenceService;
	private final RoleeRepository roleRepository;

	@Override
	public List<RequestDto> getAllRequest() {
		return requestRepository.findAll().stream().map(RequestDto::new).toList();

	}

	@Override
	public RequestDto getById(Long id) {
		RequestDto requestDto = new RequestDto();
		try {
			Optional<Request> request = requestRepository.findById(id);
			if (request.isPresent()) {
				requestDto = new RequestDto(request.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return requestDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Request> request = requestRepository.findById(id);
			if (!request.isPresent()) {
				return new Status(false, "Request Not Found");
			}

			requestRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Status saveOrUpdate(@Valid RequestDto requestDto) {
		try {
			Branch branch = BranchContextHolder.getCurrentBranch();
			Request request = requestDto.getId() == null ? this.newRequest(requestDto) : this.setRequest(requestDto);
			request.setBranch(branch);

			request = requestRepository.save(request);
			return new Status(true, ((requestDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Request newRequest(RequestDto requestDto) {

		Request request = new Request();
		request.setFirstName(requestDto.getFirstName());
		request.setLastName(requestDto.getLastName());
		request.setEmail(requestDto.getEmail());
		request.setPhone(requestDto.getPhone());
		request.setAppointmentDate(requestDto.getAppointmentDate());
		request.setIsAccept(false);
		request.setIsReject(false);
		request.setDoctor(new Doctor(requestDto.getDoctor()));
		request.setDob(requestDto.getDob());
		request.setAppointmentType(requestDto.getAppointmentType());
		request.setVisitType(requestDto.getVisitType());
		request.setGender(requestDto.getGender());
		request.setDistrict(requestDto.getDistrict());
		request.setCountry(requestDto.getCountry());
		request.setState(requestDto.getState());
		request.setCity(requestDto.getCity());

		if (requestDto.getBranch() != null) {
			request.setBranch(requestDto.getBranch());
		}

		return request;

	}

	private Request setRequest(RequestDto requestDto) {
		Request exRequest = requestRepository.findById(requestDto.getId()).get();
		exRequest.setFirstName(requestDto.getFirstName());
		exRequest.setLastName(requestDto.getLastName());
		exRequest.setIsAccept(requestDto.getIsAccept());
		exRequest.setEmail(requestDto.getEmail());
		exRequest.setPhone(requestDto.getPhone());
		exRequest.setAppointmentDate(requestDto.getAppointmentDate());
		exRequest.setIsReject(requestDto.getIsReject());
		exRequest.setDoctor(new Doctor(requestDto.getDoctor()));
		exRequest.setDob(requestDto.getDob());
		exRequest.setAppointmentType(requestDto.getAppointmentType());
		exRequest.setVisitType(requestDto.getVisitType());
		exRequest.setGender(requestDto.getGender());
		exRequest.setDistrict(requestDto.getDistrict());
		exRequest.setCountry(requestDto.getCountry());
		exRequest.setState(requestDto.getState());
		exRequest.setCity(requestDto.getCity());
		return exRequest;

	}

	@Override
	public Status isAccept(Long id, StatusDto statusDto) {
		try {
			requestRepository.findById(id).ifPresentOrElse(request -> {

				if (statusDto.isStatus()) {
					AppointmentsDto appointments = createAppointment(id);
					appointmentsRepository.save(new Appointments(appointments));
					request.setIsAccept(true);

				} else {
					request.setIsReject(true);
				}
				requestRepository.save(request);

			}, () -> {
				try {
					throw new Exception("Appointment Request not found");
				} catch (Exception e) {
					e.printStackTrace();
				}
			});
			return new Status(true, statusDto.isStatus() ? "Appointment accepted" : "Appointment rejected");
		} catch (Exception e) {
			return new Status(false, "Status updated Failed");
		}
	}

	public AppointmentsDto createAppointment(Long id) {
		Request request = requestRepository.findById(id).get();
		Module module = moduleRepository.findByName(ModuleEnum.patients.toString());
		String nextSequense = null;
		Branch branch = request.getBranch();
		if (branch == null) {
			throw new IllegalStateException("Current branch is not set");
		}

		AppointmentsDto appointments = new AppointmentsDto();
		Patient patient = new Patient();
		patient.setDistrict(request.getDistrict());
		patient.setCity(request.getCity());
		patient.setGender(request.getGender() == 0 ? "Male" : "Female");
		patient.setDob(request.getDob());
		patient.setFirstname(request.getFirstName());
		patient.setLastname(request.getLastName());
		patient.setBranch(branch);
		patient.setAlternativeContact(request.getPhone());
		patient.setWhatsappNo(request.getPhone());
		nextSequense = sequenceService.getNextSequense(branch.getId(), module.getId());
		patient.setUid(nextSequense);

		Role role = roleRepository.findRoleByName("Patient");
		User user = new User();
		Optional<User> isUser = userRepository.findByPhone(request.getPhone());

		if (isUser.isPresent()) {
			user = isUser.get();
		} else {
			user.setPhone(request.getPhone());
			user.setName(request.getFirstName() + " " + request.getLastName());
			user.setEmail(request.getEmail());
			user.setRole(role);
			user.setBranch(branch);
		}
		patient.setUser(user);

		appointments.setPatient(patient);
		// appointments.setDoctor(new DoctorDto(request.getDoctor()));
		// appointments.setAppointmentDate(request.getAppointmentDate());
		// appointments.setAppointmentType(request.getAppointmentType());
		// appointments.setVisitType(request.getVisitType());
		appointments.setStatus(AppointmentStatus.UPCOMING);
		return appointments;
	}

	@Override
	public Page<RequestProj> search(RequestSearch search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		if (search.getDate() == null) {
			return requestRepository.findAllByBranch_id(pr, branch.getId());
		}
		return requestRepository.findAllByAppointmentDateGreaterThanEqualAndBranch_id(pr, search.getDate(),
				branch.getId());

	}

	private Request setReSchedule(RequestDto requestDto) {
		Request exRequest = requestRepository.findById(requestDto.getId()).get();
		exRequest.setIsAccept(false);
		exRequest.setIsReject(true);
		return exRequest;

	}

	@Override
	public Status reSchedule(@Valid RequestDto requestDto) {
		try {
			Branch branch = BranchContextHolder.getCurrentBranch();
			Request requestCreate;
			Request requestUpdate;

			if (requestDto.getId() != null) {
				requestCreate = this.newRequest(requestDto);
				requestUpdate = this.setReSchedule(requestDto);
			} else {
				throw new Exception("Invalid details found");
			}
			requestCreate.setBranch(branch);
			requestUpdate.setBranch(branch);

			requestRepository.save(requestCreate);
			requestRepository.save(requestUpdate);
			return new Status(true, ((requestDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	// publicRequestSave
	@Override
	public Status publicRequestSave(@Valid RequestDto requestDto) {
		try {
			Request request = this.newRequest(requestDto);
			request = requestRepository.save(request);
			return new Status(true, "Added Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

}
