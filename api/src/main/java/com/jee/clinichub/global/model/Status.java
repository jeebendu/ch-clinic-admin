package com.jee.clinichub.global.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author jkb
 *
 * @param <T>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Status {

	//@JsonIgnore
	private Long id;
	private boolean status;
	private String message;
	
	
	public Status(boolean status, String message) {
		super();
		this.status = status;
		this.message = message;
	}
	
	
	
	
	
	
}
