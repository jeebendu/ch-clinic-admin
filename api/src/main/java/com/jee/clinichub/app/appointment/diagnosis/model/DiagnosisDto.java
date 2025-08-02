package com.jee.clinichub.app.appointment.diagnosis.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

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
public class DiagnosisDto {

	private Long id;

	@NotNull(message = "Name is mandatory")
	@Size(min = 2, max = 30, message = "Name should between 3 and 30")
	private String name;

	  @JsonCreator
    public DiagnosisDto(@JsonProperty("name") String name) {
        this.name = name;
    }

	public DiagnosisDto(Diagnosis diagnosis) {
		this.id = diagnosis.getId();
		this.name = diagnosis.getName();

	}
}
