package com.jee.clinichub.app.user.logininfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IpInfo {
    private String countryCode;
    private String country;
    private String region;
    private String city;
    private String isp;
    private double lat;
    private double lon;
    private boolean mobile;
}
