package com.jee.clinichub.app.occTherapist.otCheckList;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.occTherapist.otCategory.OtCategory;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenChecklistMap;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategory;
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
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "ot_checklist")
@EntityListeners(AuditingEntityListener.class)
public class OtCheckList extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "subcategory_id", nullable = false)
	private OtSubCategory subcategory;
	
	@Column(name="name")
	private String name;
	
	@Column(name="year")
	private int year;

	@Column(name="month")
	private int month;
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "checklist", cascade = CascadeType.ALL)
	 private List<OtChildrenChecklistMap> otChildrenChecklistMaps = new ArrayList<OtChildrenChecklistMap>();
	
	

	public OtCheckList(OtCheckListDto otCheckListDto) {
		super();
		this.id = otCheckListDto.getId();
		if(otCheckListDto.getSubcategory()!=null) {
			this.subcategory=new OtSubCategory(otCheckListDto.getSubcategory());
		}
		this.name = otCheckListDto.getName();
		this.year = otCheckListDto.getYear();
		this.month = otCheckListDto.getMonth();
		
	}



	public OtCheckList(Long id) {
		this.id= id;
		// TODO Auto-generated constructor stub
	}





	
}