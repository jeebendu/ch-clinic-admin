package com.jee.clinichub.app.catalog.config.config.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
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
public class ConfigDto {

    private Long id;

    private boolean importKey;

    private boolean exportKey; 

    public ConfigDto(Config config) {
		this.id = config.getId();
		this.exportKey = config.isExportKey();
		this.importKey = config.isImportKey();
	}

  
}
