
package com.jee.clinichub.app.aichat.model;

import java.io.Serializable;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.aichat.enums.MessageType;
import com.jee.clinichub.app.aichat.enums.QueryCategory;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_messages")
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(callSuper = false)
public class ChatMessage extends Auditable<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ChatSession chatSession;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "query_category")
    private QueryCategory queryCategory;

    @Column(name = "context_data", columnDefinition = "TEXT")
    private String contextData;

    public ChatMessage(ChatMessageDto dto) {
        this.id = dto.getId();
        this.message = dto.getMessage();
        this.response = dto.getResponse();
        this.messageType = dto.getMessageType();
        this.queryCategory = dto.getQueryCategory();
        this.contextData = dto.getContextData();
    }
}
