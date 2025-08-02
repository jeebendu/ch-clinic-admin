package com.jee.clinichub.app.core.dns.model;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class DnsResponse {

    private Result result;
    private boolean success;
    private List<Object> errors;
    private List<Object> messages;

    @Data
    public static class Result {
        private String id;
        private String zone_id;
        private String zone_name;
        private String name;
        private String type;
        private String content;
        private boolean proxiable;
        private boolean proxied;
        private int ttl;
        private boolean locked;
        private Meta meta;
        private String comment;
        private List<Object> tags;
        private Date created_on;
        private Date modified_on;

        @Override
        public String toString() {
            return "Result{" +
                    "id='" + id + '\'' +
                    ", zone_id='" + zone_id + '\'' +
                    ", zone_name='" + zone_name + '\'' +
                    ", name='" + name + '\'' +
                    ", type='" + type + '\'' +
                    ", content='" + content + '\'' +
                    ", proxied=" + proxied +
                    ", ttl=" + ttl +
                    ", comment='" + comment + '\'' +
                    ", created_on=" + created_on +
                    ", modified_on=" + modified_on +
                    '}';
        }
    }

    @Data
    public static class Meta {
        private boolean auto_added;
        private boolean managed_by_apps;
        private boolean managed_by_argo_tunnel;
        private String source;
    }
}