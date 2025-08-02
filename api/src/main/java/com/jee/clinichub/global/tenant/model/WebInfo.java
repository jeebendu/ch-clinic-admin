package com.jee.clinichub.global.tenant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebInfo {
	
    private String name;
    private String url;
    private String title;
    private String favIcon;
    private String bannerHome;
    private String logo;
    private String info;
    
	public WebInfo(String info) {
		super();
		this.info = info;
	}
    


    
}
