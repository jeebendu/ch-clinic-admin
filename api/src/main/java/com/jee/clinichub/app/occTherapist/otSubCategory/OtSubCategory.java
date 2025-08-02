package com.jee.clinichub.app.occTherapist.otSubCategory;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.occTherapist.otCategory.OtCategory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "ot_subcategory")
//@EntityListeners(AuditingEntityListener.class)
public class OtSubCategory  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "category_id", nullable = false)
	private OtCategory category;
	
	@Column(name="name")
	private String name; 
	
	


	public OtSubCategory(OtSubCategoryDto otSubCategoryDto) {
		super();
		this.id = otSubCategoryDto.getId();
		if(otSubCategoryDto!=null) {
			this.category=new OtCategory(otSubCategoryDto.getCategory());
		}
		this.name = otSubCategoryDto.getName();
		
		
	}


	
}