package com.jee.clinichub.app.enquiry.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.enquiry.model.Enquiry;
import com.jee.clinichub.app.enquiry.model.EnquiryProj;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {


	@Cacheable(value = "enquiryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    Page<EnquiryProj> findPagedProjectedByBranch_idOrderByIdDesc(Long id,Pageable pr);
	
	@Cacheable(value = "enquiryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @Query("SELECT e.status, COUNT(e) FROM Enquiry e where e.branch.id = :branchId GROUP BY e.status ORDER BY e.status ASC")
    List<Object[]> countByStatusGroupedByBranchId(Long branchId);

	Page<EnquiryProj> findPagedProjectedByBranch_idAndStaff_idOrderByIdDesc(Long id, Long sid, Pageable pr);


	@Cacheable(value = "enquiryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT e FROM Enquiry e WHERE e.branch.id = :branchId" +
		    " AND " +
		    "(:staffId IS NULL OR e.staff.id = :staffId) AND " +
			"(:typeId IS NULL OR e.enquiryServiceType.id = :typeId) AND " +
		    "(:statusId IS NULL OR e.status.id = :statusId) AND " +
		    "((:firstName IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) OR " +
		    "(:lastName IS NULL OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) OR " +
		    "(:city IS NULL OR LOWER(e.city) LIKE LOWER(CONCAT('%', :city, '%'))) OR " +
		    "(:mobile IS NULL OR e.mobile LIKE CONCAT('%', :mobile, '%'))" +
		    ")" +
		    " ORDER BY e.id DESC")
	Page<EnquiryProj> findPagedEnquiriesByFilters(
        Pageable pageable, 
        Long branchId, 
        Long staffId, 
        Long typeId, 
        Long statusId, 
        String firstName, 
        String lastName, 
        String mobile,
        String city
			);

	@Query("SELECT e.status, COUNT(e) FROM Enquiry e where e.branch.id = :branchId AND e.staff.id =:sid GROUP BY e.status ORDER BY e.status ASC")
	List<Object[]> countByStatusGroupedByBranchIdAndStaff_id(Long branchId, Long sid);

	@Modifying
    @Query("UPDATE Enquiry e SET e.staff.id = null WHERE e.staff.id = :id")
	void unassignStaffFromEnquiries(@Param("id") Long id);

	 @Modifying
	 @Query("DELETE FROM Enquiry e WHERE e.staff.id = :id")
	void deleteEnquiriesByStaffId(Long id);




}