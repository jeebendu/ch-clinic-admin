package com.jee.clinichub.app.catalog.config.config.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@DynamicUpdate
@Entity
@Table(name = "system_config")
@EntityListeners(AuditingEntityListener.class)
public class Config extends Auditable <String> implements Serializable{

    private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    @Column(name="is_import")
    private boolean importKey;


    @Column(name="is_export")
    private boolean exportKey; 

    public Config(ConfigDto configDto) {
		this.id = configDto.getId();
		this.exportKey = configDto.isExportKey();
		this.importKey = configDto.isImportKey();
		
	}
}
