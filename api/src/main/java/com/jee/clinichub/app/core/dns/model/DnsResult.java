package com.jee.clinichub.app.core.dns.model;

import lombok.Data;

@Data
public class DnsResult {
    private String id;
    private String type;
    private String name;
    private String content;
}