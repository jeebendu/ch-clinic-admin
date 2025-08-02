package com.jee.clinichub.app.doctor.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.model.DoctorBranchProj;
import com.jee.clinichub.app.doctor.model.DoctorClinicMapProjection;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorProj;
import com.jee.clinichub.app.doctor.model.DoctorSearch;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.doctor.model.OnBordingDoctor;
import com.jee.clinichub.app.doctor.model.SearchDoctorView;
import com.jee.clinichub.global.model.Status;


public interface DoctorService {
	
	Doctor findByName(String name);

    DoctorDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(MultipartFile profile,DoctorDto doctorDto);
	Status saveDoctor(Doctor doctor);

	List<DoctorProj> getAllDoctors();

	Page<DoctorProj> searchDoctor(Pageable pageable ,Search search);

    List<DoctorProj> getAllDoctorsFromAllBranch();

	Page<DoctorProj> getDoctorsPaged(int page, int size, String search);

	 Page<DoctorProj> search(DoctorSearch doctorSearch, int pageNo, int pageSize);

     Status createObBordingDoctor(OnBordingDoctor doctor);

     Page<DoctorWithOutBranchProj> adminSearch(DoctorSearch doctorSearch, int pageNo, int pageSize);

     List<DoctorDto> getDoctorsByBranchId(Long branchId);

     Page<DoctorClinicMapProjection> filterDoctorPublic(Pageable pageable,SearchDoctorView search);

	DoctorDto findBySlug(String slug);

    Status makeDoctorOnline(Long id);

	Optional<DoctorBranch> findDoctorBranchByGlobalId(UUID globalId);
	Optional<DoctorBranch> doctorBranchByDrAndBranchGlobalId(UUID grGlobalId,UUID branchGlobalId);
	Optional<Doctor> findDoctoryGlobalId(UUID globalId);

    Status verifyDoctor(Long id);

    List<DoctorBranchProj> getAllDoctorBranch(DoctorSearch doctorSearch);

    List<DoctorProj> getVerifyDoctorFilter(DoctorSearch doctorSearch);

    Status rejectDoctorRequest(DoctorDto doctorDto);


    DoctorBranchDto DoctorbranchById(Long drId, Long branchId);


}
