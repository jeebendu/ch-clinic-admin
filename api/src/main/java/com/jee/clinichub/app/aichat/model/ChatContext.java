
package com.jee.clinichub.app.aichat.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatContext {
    
    private String userMessage;
    private List<String> recentMessages;
    private String availableDoctors;
    private String availableClinics;
    private String specializations;
    private String userLocation;
    private String contextSummary;
}
