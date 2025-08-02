
package com.jee.clinichub.app.aichat.service;

import java.util.List;

import com.jee.clinichub.app.aichat.model.ChatMessageDto;
import com.jee.clinichub.app.aichat.model.ChatRequest;
import com.jee.clinichub.app.aichat.model.ChatResponse;
import com.jee.clinichub.app.aichat.model.ChatSessionDto;

public interface AIChatService {
    
    ChatResponse sendMessage(ChatRequest request);
    
    ChatSessionDto createNewSession(String userName, Long userId);
    
    ChatSessionDto getSession(String sessionToken);
    
    List<ChatMessageDto> getSessionMessages(String sessionToken);
    
    boolean deleteSession(String sessionToken);
    
    List<ChatSessionDto> getUserSessions(Long userId);
}
