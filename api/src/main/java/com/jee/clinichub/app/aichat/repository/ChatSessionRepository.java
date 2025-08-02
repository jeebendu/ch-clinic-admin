
package com.jee.clinichub.app.aichat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.aichat.enums.ChatStatus;
import com.jee.clinichub.app.aichat.model.ChatSession;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    
    Optional<ChatSession> findBySessionToken(String sessionToken);
    
    List<ChatSession> findByUserIdAndStatus(Long userId, ChatStatus status);
    
    @Query("SELECT s FROM ChatSession s WHERE s.userId = :userId ORDER BY s.createdTime DESC")
    List<ChatSession> findByUserIdOrderByCreatedTimeDesc(Long userId);
    
    List<ChatSession> findByStatus(ChatStatus status);
}
