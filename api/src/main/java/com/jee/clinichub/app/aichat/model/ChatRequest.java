
package com.jee.clinichub.app.aichat.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    private String message;
    private String sessionToken;
    private String context;
    private String userName;
    private Long userId;
    private List<ChatMessageContext> messages;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageContext {
        private String id;
        private String text;
        private String sender;
        private String timestamp;
    }
}
