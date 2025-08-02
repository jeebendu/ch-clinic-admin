package com.jee.clinichub.app.enquiry.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.source.model.Source;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.core.status.model.StatusModel;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateList;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateListDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderItem;
import com.jee.clinichub.app.relationship.model.Relationship;
import com.jee.clinichub.app.relationship.model.RelationshipDto;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
@Entity
@Table(name = "patient_enquiry")
@EntityListeners(AuditingEntityListener.class)
public class Enquiry extends Auditable<String>  implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "enquiry",cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private List<FollowedUpDateList> followUpList;
	
	@OneToOne
	@JoinColumn(name = "service_type_id", nullable = true)
	private EnquiryServiceType enquiryServiceType;

	@OneToOne
	@JoinColumn(name = "country_id", nullable = true)
	private Country country;

	@OneToOne
	@JoinColumn(name = "state_id", nullable = true)
	private State state;

	@OneToOne
	@JoinColumn(name = "relation_id", nullable = true)
	private Relationship relationship;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;

	@OneToOne
	@JoinColumn(name = "district_id", nullable = true)
	private District district;
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;

	@Column(name="mobile")
	private String mobile;

	@Column(name="lead_date")
	private Date leadDate;
	
	@Column(name="follow_up_by")
	private String followUpBy;

	@OneToOne
	@JoinColumn(name = "source_id", nullable = true)
	private Source source;

	@OneToOne
	@JoinColumn(name = "status_id", nullable = true)
	private StatusModel status;
	

	@Column(name="city")
	private String city;

	@Column(name="country_code")
	private String countryCode;

	@Column(name="remark")
	private String remark;

	@Column(name="needs")
	private String needs;

	@Column(name="notes")
	private String notes;

	@OneToOne
	@JoinColumn(name="assign_to", nullable = true)
	private Staff staff;
	


	public Enquiry(EnquiryDto enquiryDto) {
		super();
		this.id = enquiryDto.getId();
		this.enquiryServiceType = new EnquiryServiceType(enquiryDto.getEnquiryServiceType());
		this.firstName = enquiryDto.getFirstName();
		this.lastName = enquiryDto.getLastName();
		this.mobile = enquiryDto.getMobile();
		this.relationship = new Relationship(enquiryDto.getRelationship());
		this.leadDate = enquiryDto.getLeadDate();
		this.followUpBy = enquiryDto.getFollowUpBy();
		this.status = new StatusModel(enquiryDto.getStatus());
		this.country = new Country(enquiryDto.getCountry());
		this.city = enquiryDto.getCity();
		this.state = new State(enquiryDto.getState());
		this.countryCode = enquiryDto.getCountryCode();
		this.remark = enquiryDto.getRemark();
		this.source =new Source(enquiryDto.getSource());
		this.needs = enquiryDto.getNeeds();
		this.notes = enquiryDto.getNotes();
		this.staff = new Staff(enquiryDto.getStaff());
		this.district = new District(enquiryDto.getDistrict());

	}






	

	
}