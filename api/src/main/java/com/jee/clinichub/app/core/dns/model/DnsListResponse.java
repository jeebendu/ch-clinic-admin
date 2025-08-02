package com.jee.clinichub.app.core.dns.model;

import java.util.List;
import lombok.Data;

@Data
public class DnsListResponse {
    private boolean success;
    private List<Object> errors;
    private List<Object> messages;
    private List<DnsResult> result;
}