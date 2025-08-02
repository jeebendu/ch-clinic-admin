package com.jee.clinichub.app.user.otp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "user_otp")
public class Otp {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="user_id")
    private Long userId;
    @Column(name="email_or_mobile")
    private String emailOrMobile;
    private String session;
    private String otp;
    private String reason;
    @Column(name="expiry_time")
    private LocalDateTime expiryTime;
    @Column(name="created_time")
    private LocalDateTime createdTime;
    @Column(name="used_time")
    private LocalDateTime usedTime;
    private boolean used;
    private int attempts;
	
    // @NotBlank
    // private final String code;
    // @NotBlank
    // private final String txnId;
    
	// public Otp(@NotBlank String code, @NotBlank String txnId) {
	// 	super();
	// 	this.code = code;
	// 	this.txnId = txnId;
	// }
	// public String getCode() {
	// 	return code;
	// }
	// public String getTxnId() {
	// 	return txnId;
	// }
    // public Otp() {
    //     this.code = "defaultCode";
    //     this.txnId = "defaultTxnId";
    // }

    
   
}
