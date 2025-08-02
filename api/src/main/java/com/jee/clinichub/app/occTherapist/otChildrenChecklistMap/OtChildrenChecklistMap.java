
package com.jee.clinichub.app.occTherapist.otChildrenChecklistMap;

import java.io.Serializable;
import java.util.Date;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.occTherapist.children.Children;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategory;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckList;
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
@Table(name = "ot_children_checklist_map")
@EntityListeners(AuditingEntityListener.class)
public class OtChildrenChecklistMap   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne( fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "children_id", nullable = false)
	private Children children;
	
	@ManyToOne( fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "checklist_id", nullable = false)
	private OtCheckList checklist;
	
	
	@Column(name="achieved")
	private boolean achieved;
	
	@Column(name="date")
	private Date date;


	
	public OtChildrenChecklistMap(OtChildrenCheckListMapDto otChildrenCheckListMapDto) {
		super();
		this.id = otChildrenCheckListMapDto.getId();
		this.checklist=new OtCheckList(otChildrenCheckListMapDto.getChecklist());
		this.achieved = otChildrenCheckListMapDto.isAchieved();
		this.date = otChildrenCheckListMapDto.getDate();
	}



	public OtChildrenChecklistMap(Children children, OtCheckList checklist, boolean achieved, Date date) {
		super();
		this.children = children;
		this.checklist = checklist;
		this.achieved = achieved;
		this.date = date;
	}


	
}
