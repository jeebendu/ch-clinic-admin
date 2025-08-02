
package com.jee.clinichub.app.aichat.service;

import com.jee.clinichub.app.aichat.model.ChatContext;

public interface GeminiService {
    
    String generateResponse(String userMessage, ChatContext context);
    
    String categorizeQuery(String userMessage);
    
    boolean isServiceAvailable();
}
