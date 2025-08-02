
package com.jee.clinichub.global.tenant.model;

public enum ApprovalStep {
    VALIDATION("Validating tenant request"),
    DNS_CREATION("Creating DNS record"),
    MASTER_SCHEMA_SETUP("Setting up master schema entities"),
    TENANT_SCHEMA_CREATION("Creating tenant database schema"),
    TENANT_DATA_INITIALIZATION("Initializing tenant data"),
    STATUS_UPDATE("Updating request status");

    private final String description;

    ApprovalStep(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
