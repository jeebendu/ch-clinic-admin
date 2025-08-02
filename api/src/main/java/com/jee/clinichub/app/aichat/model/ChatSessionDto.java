
package com.jee.clinichub.app.aichat.model;

import java.util.List;
import java.util.stream.Collectors;

import com.jee.clinichub.app.aichat.enums.ChatStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionDto {
    
    private Long id;
    private String sessionToken;
    private Long userId;
    private String userName;
    private ChatStatus status;
    private List<ChatMessageDto> messages;

    public ChatSessionDto(ChatSession session) {
        this.id = session.getId();
        this.sessionToken = session.getSessionToken();
        this.userId = session.getUserId();
        this.userName = session.getUserName();
        this.status = session.getStatus();
        if (session.getMessages() != null) {
            this.messages = session.getMessages().stream()
                .map(ChatMessageDto::new)
                .collect(Collectors.toList());
        }
    }
}
