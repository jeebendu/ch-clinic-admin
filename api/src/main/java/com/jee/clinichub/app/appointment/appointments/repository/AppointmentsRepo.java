package com.jee.clinichub.app.appointment.appointments.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsProj;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.patient.model.Patient;

@Repository
public interface AppointmentsRepo extends JpaRepository<Appointments, Long> {

        // @CacheEvict(value = "requestCache", allEntries = true, keyGenerator =
        // "multiTenantCacheKeyGenerator")
        // Page<RequestProj> findAllByAppointmentDateGreaterThanEqual(Pageable pageable,
        // @Param("date") Date date);

        // @CacheEvict(value = "requestCache", allEntries = true, keyGenerator =
        // "multiTenantCacheKeyGenerator")
        // @Query("SELECT r FROM Request r " +
        // "WHERE (:date IS NULL OR r.appointmentDate >= :date) " +
        // "ORDER BY r.id DESC")
        // Page<RequestProj> findAllIfDateNull(Pageable pr, Date date);

        boolean existsByPatient_user_phoneAndIdNot(String phone, long l);

        boolean existsByPatient_user_phone(String phone);

        // @Query("SELECT a FROM Appointments a " +
        // "WHERE a.status IS NULL OR a.status = :status " +
        // "AND (:doctors IS NULL OR a.doctorBranch.doctor.id IN :doctors)" +
        // "ORDER BY a.id DESC")
        // Page<AppointmentsProj> getappointFilterData(Pageable pr, AppointmentStatus
        // status,List<Long> doctors);

        @Query("""
                            SELECT a FROM Appointments a
                            WHERE (a.status IS NULL OR a.status = :status)
                              AND (:doctors IS NULL OR a.doctorBranch.doctor.id IN :doctors)
                              AND (
                                    (:type = 'Patient' AND :value IS NOT NULL AND :value <> '' AND
                                        (LOWER(a.patient.firstname) LIKE LOWER(CONCAT('%', :value, '%'))
                                      OR LOWER(a.patient.lastname) LIKE LOWER(CONCAT('%', :value, '%'))
                                      )
                                    ) OR
                                    (:type = 'Doctor' AND :value IS NOT NULL AND :value <> '' AND
                                        (LOWER(a.doctorBranch.doctor.firstname) LIKE LOWER(CONCAT('%', :value, '%'))
                                      OR LOWER(a.doctorBranch.doctor.lastname) LIKE LOWER(CONCAT('%', :value, '%')))
                                    ) OR
                                    (:type = 'BookingId' AND :value IS NOT NULL AND :value <> '' AND
                                        LOWER(a.bookingId) LIKE LOWER(CONCAT('%', :value, '%'))
                                    ) OR
                                    (:type IS NULL OR :type = '' OR :value IS NULL OR :value = '')
                                )
                            ORDER BY a.id DESC
                        """)
        Page<AppointmentsProj> getAppointmentFilterData(
                        Pageable pr,
                        @Param("status") AppointmentStatus status,
                        @Param("doctors") List<Long> doctors,
                        @Param("type") String type,
                        @Param("value") String value);

        Page<AppointmentsProj> findAllBySlot_dateGreaterThanEqual(Pageable pr, Date date);

        @Query("SELECT a FROM Appointments a WHERE a.patient.id = :patientId AND " +
                        "(:name = 'UPCOMING' AND a.status = com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus.UPCOMING OR "
                        +
                        ":name = 'COMPLETED' AND a.status = com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus.COMPLETED OR "
                        +
                        ":name = 'CANCELLED' AND a.status = com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus.CANCELLED)")
        List<AppointmentsProj> findAppointmentsByType(
                        @Param("name") String name,
                        @Param("patientId") Long patientId,
                        @Param("appointmentDate") Date appointmentDate);

        @Query("SELECT a FROM Appointments a WHERE a.doctorBranch.doctor.id = :drId " +
                        "AND (:branches IS NULL OR a.doctorBranch.branch.id IN :branches) " +
                        "AND (:statuses IS NULL OR a.status IN :statuses) " +
                        "AND (:searchTerm IS NULL OR LOWER(a.patient.firstname) LIKE CONCAT('%', LOWER(:searchTerm), '%') "
                        +
                        "OR LOWER(a.patient.lastname) LIKE CONCAT('%', LOWER(:searchTerm), '%'))")
        Page<AppointmentsProj> findAppointmentsByDrId(Pageable pageable, Long drId,
                        @Param("branches") List<Long> branches,
                        @Param("statuses") List<AppointmentStatus> statuses,
                        @Param("searchTerm") String searchTerm);
        // @Param("startDate") LocalDate startDate,
        // @Param("endDate") LocalDate endDate);
        // patient

        @Query("SELECT DISTINCT a.patient FROM Appointments a " +
                        "WHERE a.doctorBranch.doctor.id = :drId " +
                        "AND (:branches IS NULL OR a.doctorBranch.branch.id IN :branches) " +
                        "AND (:genders IS NULL OR a.patient.gender IN :genders) " +
                        "AND (:searchTerm IS NULL OR LOWER(a.patient.firstname) LIKE CONCAT('%', LOWER(:searchTerm), '%') "
                        +
                        "OR LOWER(a.patient.lastname) LIKE CONCAT('%', LOWER(:searchTerm), '%'))")
        Page<Patient> findUniquePatientsByDrId(Pageable pageable, @Param("drId") Long drId,
                        @Param("branches") List<Long> branches,
                        @Param("searchTerm") String searchTerm,
                        @Param("genders") List<String> genders);

        @Query("SELECT a FROM Appointments a WHERE (:branches IS NULL OR a.doctorBranch.branch.id IN :branches)" +
                        "AND (:statuses IS NULL OR a.status IN :statuses) " +
                        "AND (:searchTerm IS NULL OR LOWER(a.patient.firstname) LIKE CONCAT('%', LOWER(:searchTerm), '%') "
                        +
                        "OR LOWER(a.patient.lastname) LIKE CONCAT('%', LOWER(:searchTerm), '%'))")
        Page<AppointmentsProj> appointmentForClinicBranch(Pageable pageable, List<Long> branches,
                        List<AppointmentStatus> statuses, String searchTerm);

        List<Appointments> findAllBySlot_dateLessThanAndStatus(Date today, AppointmentStatus upcoming);

        @Query("SELECT a FROM Appointments a WHERE a.patient.id = :patientId AND a.status = :status")
        Page<AppointmentsProj> filterPatientAppointment(Pageable pageble, @Param("status") AppointmentStatus status,
                        @Param("patientId") Long patientId);

        boolean existsByPatient_idAndDoctorBranch_doctor_idAndStatus(Long patientId, Long doctorId,
                        AppointmentStatus completed);

        Optional<Appointments> findByGlobalAppointmentId(UUID globalAppointmentId);

        boolean existsByPatient_idAndDoctorBranch_idAndSlot_date(Long id, Long id2, Date date);

        boolean existsByPatient_idAndFamilyMember_idAndDoctorBranch_idAndSlot_date(Long id, Long id2, Long id3,
                        Date date);

        @Query("SELECT DISTINCT a.doctorBranch.doctor FROM Appointments a ")
        List<Doctor> findDoctorsFromAppointment();

}
