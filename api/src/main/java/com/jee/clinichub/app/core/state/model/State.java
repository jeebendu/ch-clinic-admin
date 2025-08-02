package com.jee.clinichub.app.core.state.model;
import java.io.Serializable;

import com.jee.clinichub.app.core.country.model.Country;
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
import lombok.NoArgsConstructor;

@Table(name="core_state")
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class State extends Auditable<String>  implements Serializable{

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "country_id", nullable = true)
    private Country country;

    @Column(name="name")
    private String name;
    
    @Column(name="code")
    private String code;

    public State(StateDto stateDto)
    {
        if (stateDto != null && stateDto.getId() != null) {
            this.id = stateDto.getId();
            
        }
        this.country=new Country(stateDto.getCountry());
        this.name=stateDto.getName();
        this.code=stateDto.code;
    }
}
