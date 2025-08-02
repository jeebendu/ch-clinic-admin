
package com.jee.clinichub.global.tenant.service;

import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.model.ApprovalProgress;

public interface TenantApprovalService {
    Status executeApproval(Long id, String subdomainReq);
    void rollbackApproval(ApprovalProgress progress);
}
