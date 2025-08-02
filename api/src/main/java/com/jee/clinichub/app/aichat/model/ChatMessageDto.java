
package com.jee.clinichub.app.aichat.model;

import com.jee.clinichub.app.aichat.enums.MessageType;
import com.jee.clinichub.app.aichat.enums.QueryCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    
    private Long id;
    private Long sessionId;
    private String message;
    private String response;
    private MessageType messageType;
    private QueryCategory queryCategory;
    private String contextData;

    public ChatMessageDto(ChatMessage message) {
        this.id = message.getId();
        this.sessionId = message.getChatSession() != null ? message.getChatSession().getId() : null;
        this.message = message.getMessage();
        this.response = message.getResponse();
        this.messageType = message.getMessageType();
        this.queryCategory = message.getQueryCategory();
        this.contextData = message.getContextData();
    }
}
