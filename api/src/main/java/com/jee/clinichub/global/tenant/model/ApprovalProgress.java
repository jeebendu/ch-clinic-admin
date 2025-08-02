
package com.jee.clinichub.global.tenant.model;

import java.util.HashSet;
import java.util.Set;

import lombok.Data;

@Data
public class ApprovalProgress {
    private String clientId;
    private ApprovalStep currentStep;
    private Set<String> completedSteps = new HashSet<>();
    private String errorMessage;
    private ApprovalStep failedStep;
    private TenantRequest tenantRequest;
    private Long tenantId;
    private Long clinicMasterId;

    public ApprovalProgress(String clientId) {
        this.clientId = clientId;
    }

    public void markStepCompleted(ApprovalStep step) {
        this.completedSteps.add(step.name());
    }

    public void setError(ApprovalStep step, String errorMessage) {
        this.failedStep = step;
        this.errorMessage = errorMessage;
    }

    public boolean isStepCompleted(ApprovalStep step) {
        return completedSteps.contains(step.name());
    }
}
