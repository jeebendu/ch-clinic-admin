
package com.jee.clinichub.app.doctor.slots.model;

public enum SlotStatus {
    AVAILABLE,
    BOOKED,
    BLOCKED,
    CANCELLED,
    PENDING,    // New status for unreleased slots
    RELEASED    // New status for released slots
}
