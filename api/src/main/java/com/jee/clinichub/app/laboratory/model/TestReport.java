
package com.jee.clinichub.app.laboratory.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.patient.model.Patient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class TestReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_number", unique = true, nullable = false, length = 50)
    private String reportNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_type_id", nullable = false)
    private TestType testType;

    @Column(name = "report_date", nullable = false)
    private LocalDateTime reportDate;

    @Column(length = 1000)
    private String diagnosis;

    @Column(length = 1000)
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestReportStatus status = TestReportStatus.PENDING;

    @OneToMany(mappedBy = "testReport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<TestResult> results;

    // Audit fields
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;

    @CreatedDate
    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @LastModifiedBy
    @Column(name = "modified_by")
    private String modifiedBy;

    @LastModifiedDate
    @Column(name = "modified_time")
    private LocalDateTime modifiedTime;

    public enum TestReportStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        REVIEWED,
        CANCELLED
    }
}
