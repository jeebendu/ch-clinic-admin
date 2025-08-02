package com.jee.clinichub.app.core.dns.model;

import java.util.ArrayList;

import lombok.Data;

@Data
public class Dns {

	public String content;
    public String name;
    public boolean proxied;
    public String type;
    public String comment;
    public ArrayList<Object> tags;
    public int ttl;
}
