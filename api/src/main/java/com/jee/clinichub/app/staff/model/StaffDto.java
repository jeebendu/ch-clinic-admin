package com.jee.clinichub.app.staff.model;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.user.model.UserDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@JsonPropertyOrder(alphabetic = true)
public class StaffDto {
    
    private Long id;
	private String uid;
	@NotNull(message = "Firstname is mandatory")
	@Size(min=4, max=20,message = "Name should between 4 and 20")
	private String firstname;
	
	@NotNull(message = "Lastname is mandatory")
	@Size(min=4, max=20,message = "Name should between 2 and 20")
	private String lastname;
	
	private Date dob;
	private Integer age;
	private String gender;
	private String whatsappNo;
	private String address;
	private UserDto user;
	private Set<BranchDto> branchList;
	private String profile;

	
	public StaffDto(Staff staff) {
		this.id = staff.getId();
		this.uid=staff.getUid();
		this.dob=staff.getDob();
		this.age=staff.getAge();
		this.gender=staff.getGender();
		this.whatsappNo=staff.getWhatsappNo();
		this.address=staff.getAddress();
		this.firstname=staff.getFirstname();
		this.lastname=staff.getLastname();
		this.profile=staff.getProfile();
		if(staff.getUser()!=null){
			this.user=new UserDto(staff.getUser());
		}
		if (staff.getBranchList() != null) {
            this.branchList = staff.getBranchList().stream()
                .map(BranchDto::new)
                .collect(Collectors.toSet());
        }
	}
	

    
    
}