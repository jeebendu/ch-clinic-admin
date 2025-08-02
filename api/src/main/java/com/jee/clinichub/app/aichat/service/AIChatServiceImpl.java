
package com.jee.clinichub.app.aichat.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.aichat.enums.ChatStatus;
import com.jee.clinichub.app.aichat.enums.MessageType;
import com.jee.clinichub.app.aichat.enums.QueryCategory;
import com.jee.clinichub.app.aichat.model.ChatContext;
import com.jee.clinichub.app.aichat.model.ChatMessage;
import com.jee.clinichub.app.aichat.model.ChatMessageDto;
import com.jee.clinichub.app.aichat.model.ChatRequest;
import com.jee.clinichub.app.aichat.model.ChatResponse;
import com.jee.clinichub.app.aichat.model.ChatSession;
import com.jee.clinichub.app.aichat.model.ChatSessionDto;
import com.jee.clinichub.app.aichat.repository.ChatMessageRepository;
import com.jee.clinichub.app.aichat.repository.ChatSessionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class AIChatServiceImpl implements AIChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final GeminiService geminiService;
    private final ChatContextService chatContextService;

    @Override
    @Transactional
    public ChatResponse sendMessage(ChatRequest request) {
        try {
            // Get or create session
            ChatSession session = getOrCreateSession(request);
            
            // Build context for AI
            ChatContext context = chatContextService.buildContext(request.getMessage(), session.getId());
            
            // Categorize query
            String categoryStr = geminiService.categorizeQuery(request.getMessage());
            QueryCategory category = parseQueryCategory(categoryStr);
            
            // Generate AI response
            String aiResponse = geminiService.generateResponse(request.getMessage(), context);
            
            // Save user message
            ChatMessage userMessage = new ChatMessage();
            userMessage.setChatSession(session);
            userMessage.setMessage(request.getMessage());
            userMessage.setMessageType(MessageType.USER);
            userMessage.setQueryCategory(category);
            chatMessageRepository.save(userMessage);
            
            // Save AI response
            ChatMessage aiMessage = new ChatMessage();
            aiMessage.setChatSession(session);
            aiMessage.setMessage(request.getMessage());
            aiMessage.setResponse(aiResponse);
            aiMessage.setMessageType(MessageType.AI);
            aiMessage.setQueryCategory(category);
            chatMessageRepository.save(aiMessage);
            
            return new ChatResponse(aiResponse, session.getSessionToken(), category);
            
        } catch (Exception e) {
            log.error("Error processing chat message: ", e);
            ChatResponse errorResponse = new ChatResponse();
            errorResponse.setSuccess(false);
            errorResponse.setErrorMessage("I'm sorry, I encountered an error while processing your request.");
            errorResponse.setResponse("I'm having technical difficulties. Please try again later.");
            return errorResponse;
        }
    }

    @Override
    @Transactional
    public ChatSessionDto createNewSession(String userName, Long userId) {
        try {
            ChatSession session = new ChatSession();
            session.setSessionToken(UUID.randomUUID().toString());
            session.setUserName(userName);
            session.setUserId(userId);
            session.setStatus(ChatStatus.ACTIVE);
            
            ChatSession savedSession = chatSessionRepository.save(session);
            return new ChatSessionDto(savedSession);
            
        } catch (Exception e) {
            log.error("Error creating new chat session: ", e);
            throw new RuntimeException("Failed to create new chat session");
        }
    }

    @Override
    public ChatSessionDto getSession(String sessionToken) {
        Optional<ChatSession> session = chatSessionRepository.findBySessionToken(sessionToken);
        return session.map(ChatSessionDto::new).orElse(null);
    }

    @Override
    public List<ChatMessageDto> getSessionMessages(String sessionToken) {
        Optional<ChatSession> session = chatSessionRepository.findBySessionToken(sessionToken);
        if (session.isPresent()) {
            List<ChatMessage> messages = chatMessageRepository
                .findByChatSessionIdOrderByCreatedTimeAsc(session.get().getId());
            return messages.stream()
                .map(ChatMessageDto::new)
                .collect(Collectors.toList());
        }
        return List.of();
    }

    @Override
    @Transactional
    public boolean deleteSession(String sessionToken) {
        try {
            Optional<ChatSession> session = chatSessionRepository.findBySessionToken(sessionToken);
            if (session.isPresent()) {
                session.get().setStatus(ChatStatus.ARCHIVED);
                chatSessionRepository.save(session.get());
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Error deleting chat session: ", e);
            return false;
        }
    }

    @Override
    public List<ChatSessionDto> getUserSessions(Long userId) {
        List<ChatSession> sessions = chatSessionRepository
            .findByUserIdOrderByCreatedTimeDesc(userId);
        return sessions.stream()
            .map(ChatSessionDto::new)
            .collect(Collectors.toList());
    }

    private ChatSession getOrCreateSession(ChatRequest request) {
        if (request.getSessionToken() != null) {
            Optional<ChatSession> existingSession = chatSessionRepository
                .findBySessionToken(request.getSessionToken());
            if (existingSession.isPresent()) {
                return existingSession.get();
            }
        }
        
        // Create new session
        ChatSession newSession = new ChatSession();
        newSession.setSessionToken(UUID.randomUUID().toString());
        newSession.setUserName(request.getUserName());
        newSession.setUserId(request.getUserId());
        newSession.setStatus(ChatStatus.ACTIVE);
        
        return chatSessionRepository.save(newSession);
    }

    private QueryCategory parseQueryCategory(String categoryStr) {
        try {
            return QueryCategory.valueOf(categoryStr.trim().toUpperCase());
        } catch (Exception e) {
            return QueryCategory.GENERAL;
        }
    }
}
