
package com.jee.clinichub.app.aichat.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.aichat.enums.QueryCategory;
import com.jee.clinichub.app.aichat.model.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByChatSessionIdOrderByCreatedTimeAsc(Long sessionId);
    
    Page<ChatMessage> findByChatSessionIdOrderByCreatedTimeDesc(Long sessionId, Pageable pageable);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.chatSession.id = :sessionId ORDER BY m.createdTime DESC")
    List<ChatMessage> findRecentMessagesBySessionId(Long sessionId, Pageable pageable);
    
    List<ChatMessage> findByQueryCategory(QueryCategory category);
    
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.chatSession.id = :sessionId")
    Long countMessagesBySessionId(Long sessionId);
}
