package com.jee.clinichub.app.user.resetPassword.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
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
@Table(name = "reset_password")
public class ResetPassword extends Auditable<String>  implements Serializable{

	
	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	@OneToOne
	@JoinColumn(name = "user_id", nullable = true)
	private User user;
	
	@Column(name = "token", length = 50,nullable = true)
	private String token;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "reset_time", nullable = true)
	private Date resetTime;
	
	public ResetPassword(long id,User user,String token) {
		this.id=id;
		this.user=user;
		this.token=token;
		
	}
	public ResetPassword(User user,String token) {
		
		this.user=user;
		this.token=token;
		
	}
    public boolean isExpired() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isExpired'");
    }
}
