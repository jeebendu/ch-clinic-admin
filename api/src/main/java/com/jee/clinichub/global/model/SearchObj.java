package com.jee.clinichub.global.model;

import lombok.Data;

@Data
public class SearchObj {
	private String id;
	private String name;
	private String firstname;
	private String lastname;
	private String mobile;
	private Long staffId;
	private Long statusId;
	private Long typeId;
	private String searchKey;

	public boolean allFieldsAreNull() {
        return (staffId == null) &&
               (statusId == null) &&
               (typeId == null) &&
               (name == null || name.trim().isEmpty());
    }

}
