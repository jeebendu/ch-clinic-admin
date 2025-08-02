package com.jee.clinichub.app.core.dns.service;

public interface DnsService {
    boolean createDns(String clientId);
    boolean deleteDns(String clientId);
    boolean doesDnsRecordExist(String subdomain);
}
