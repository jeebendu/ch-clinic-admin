package com.jee.clinichub.app.core.district.model;



import java.io.Serializable;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="core_district")
public class District extends Auditable<String> implements Serializable{

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(name="name")
    private String name;


    @OneToOne
    @JoinColumn(name = "state_id")
    State state;
    
    public District(DistrictDto districtDto)
    {
        if(districtDto!=null && districtDto.getId()!=null){
            this.id=districtDto.getId();
        }
        this.state=new State(districtDto.getState());
        this.name=districtDto.getName();
    }

    public District(long id) {
		this.id=id;
	}
    
}
