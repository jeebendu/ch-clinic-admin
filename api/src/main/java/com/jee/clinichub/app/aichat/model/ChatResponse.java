
package com.jee.clinichub.app.aichat.model;

import com.jee.clinichub.app.aichat.enums.QueryCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private String response;
    private String sessionToken;
    private QueryCategory queryCategory;
    private String contextData;
    private boolean success;
    private String errorMessage;

    public ChatResponse(String response, String sessionToken, QueryCategory category) {
        this.response = response;
        this.sessionToken = sessionToken;
        this.queryCategory = category;
        this.success = true;
    }
}
