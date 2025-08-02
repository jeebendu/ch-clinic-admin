package com.jee.clinichub.global.utility;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class Base64Converter {
	
	public static String encodeToBase64Json(Object data) throws JsonProcessingException {
	    ObjectMapper mapper = new ObjectMapper();
	    String json = mapper.writeValueAsString(data);
	    log.info(json);
	    return Base64.getEncoder().encodeToString(json.getBytes(StandardCharsets.UTF_8));
	}

}
