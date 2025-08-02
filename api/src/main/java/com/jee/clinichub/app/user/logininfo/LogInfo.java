package com.jee.clinichub.app.user.logininfo;

import java.time.LocalDateTime;

import com.jee.clinichub.app.user.model.User;

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

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_login_info")
public class LogInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "status")
    private boolean status;

    @Column(name = "username")
    private String userName;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "country")
    private String country;
    
    @Column(name = "region")
    private String region;

    @Column(name = "city")
    private String city;

    @Column(name = "lat")
    private double lat;

    @Column(name = "lon")
    private double lon;

    @Column(name = "mobile")
    private boolean mobile;
    

}
