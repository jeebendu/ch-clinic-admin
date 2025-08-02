
package com.jee.clinichub.app.laboratory.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_report_id", nullable = false)
    @JsonBackReference
    private TestReport testReport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "test_parameter_id", nullable = false)
    private TestParameter testParameter;

    @Column(name = "result_value", precision = 10, scale = 2)
    private BigDecimal resultValue;

    @Column(name = "result_text", length = 500)
    private String resultText;

    @Column(name = "unit_override", length = 20)
    private String unitOverride;

    @Column(length = 500)
    private String notes;

    @Enumerated(EnumType.STRING)
    private ResultFlag flag;

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

    public enum ResultFlag {
        NORMAL,
        HIGH,
        LOW,
        CRITICAL_HIGH,
        CRITICAL_LOW,
        ABNORMAL
    }
}
