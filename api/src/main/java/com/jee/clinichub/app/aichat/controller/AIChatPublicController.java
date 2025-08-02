
package com.jee.clinichub.app.aichat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.aichat.model.ChatMessageDto;
import com.jee.clinichub.app.aichat.model.ChatRequest;
import com.jee.clinichub.app.aichat.model.ChatResponse;
import com.jee.clinichub.app.aichat.model.ChatSessionDto;
import com.jee.clinichub.app.aichat.service.AIChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/v1/public/aichat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIChatPublicController {

    private final AIChatService aiChatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        try {
            ChatResponse response = aiChatService.sendMessage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in public chat message endpoint: ", e);
            ChatResponse errorResponse = new ChatResponse();
            errorResponse.setSuccess(false);
            errorResponse.setErrorMessage("Service temporarily unavailable");
            errorResponse.setResponse("I'm sorry, I'm currently unavailable. Please try again later.");
            return ResponseEntity.ok(errorResponse);
        }
    }

    @PostMapping("/session/new")
    public ResponseEntity<ChatSessionDto> createNewSession(@RequestBody ChatRequest request) {
        try {
            ChatSessionDto session = aiChatService.createNewSession(
                request.getUserName(), 
                request.getUserId()
            );
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Error creating new session: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/session/{sessionToken}")
    public ResponseEntity<ChatSessionDto> getSession(@PathVariable String sessionToken) {
        try {
            ChatSessionDto session = aiChatService.getSession(sessionToken);
            if (session != null) {
                return ResponseEntity.ok(session);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error getting session: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/session/{sessionToken}/messages")
    public ResponseEntity<List<ChatMessageDto>> getSessionMessages(@PathVariable String sessionToken) {
        try {
            List<ChatMessageDto> messages = aiChatService.getSessionMessages(sessionToken);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error getting session messages: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
