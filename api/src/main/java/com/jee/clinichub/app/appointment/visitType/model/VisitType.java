package com.jee.clinichub.app.appointment.visitType.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;



@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "appointment_visit_type")
@EntityListeners(AuditingEntityListener.class)
public class VisitType extends Auditable <String> implements Serializable{

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    private String name;

}
