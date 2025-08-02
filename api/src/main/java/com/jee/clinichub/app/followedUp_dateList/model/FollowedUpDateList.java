package com.jee.clinichub.app.followedUp_dateList.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.enquiry.model.Enquiry;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Builder
@Entity

@Table(name = "patient_enquiry_followup")
@EntityListeners(AuditingEntityListener.class)
public class FollowedUpDateList extends Auditable<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "remark")
    private String remark;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "follow_up_date")
    private Date followUpDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "next_follow_up_date")
    private Date nextFollowUpDate;

    @OneToOne
    @JoinColumn(name = "follow_up_by",nullable=true)
    private Staff followUpBy;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "enquiry_id", nullable = true)
    private Enquiry enquiry;

    public FollowedUpDateList(FollowedUpDateListDto followedUpDateListDto) {
        this.id = followedUpDateListDto.getId();
        this.remark = followedUpDateListDto.getRemark();
        this.followUpDate = followedUpDateListDto.getFollowUpDate();
        this.enquiry = new Enquiry(followedUpDateListDto.getEnquiry());
        this.nextFollowUpDate = followedUpDateListDto.getNextFollowUpDate();
       // this.followUpBy=new Staff(followedUpDateListDto.getFollowUpBy());
        
    }
}
