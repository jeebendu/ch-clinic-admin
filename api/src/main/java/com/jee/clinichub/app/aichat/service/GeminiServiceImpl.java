
package com.jee.clinichub.app.aichat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.aichat.model.ChatContext;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent}")
    private String geminiApiUrl;

    @Override
    public String generateResponse(String userMessage, ChatContext context) {
        try {
            String prompt = buildPrompt(userMessage, context);
            
            String requestBody = String.format("""
                {
                    "contents": [{
                        "parts": [{
                            "text": "%s"
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.95,
                        "maxOutputTokens": 256
                    }
                }
                """, prompt.replace("\"", "\\\""));

            String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            return parseGeminiResponse(response);
            
        } catch (Exception e) {
            log.error("Error calling Gemini API: ", e);
            return "Sorry, I'm having trouble right now. Please try again in a moment.";
        }
    }

    @Override
    public String categorizeQuery(String userMessage) {
        try {
            String prompt = String.format("""
                Categorize this medical query into one of these categories:
                - DOCTOR_SEARCH: Questions about finding doctors, their specializations, availability, locations
                - CLINIC_INFO: Questions about clinic locations, services, contact information
                - APPOINTMENT_BOOKING: Questions about booking appointments, scheduling, availability
                - SPECIALIZATION_INFO: Questions about medical specialties, treatments
                - SYMPTOM_ANALYSIS: Questions about symptoms, health problems, medical conditions
                - LOCATION_SEARCH: Questions about doctor or clinic locations, branches, addresses, places
                - GENERAL_MEDICAL: General health and medical information questions
                - GENERAL: Other general questions
                
                Query: "%s"
                
                Respond with only the category name.
                """, userMessage);

            String requestBody = String.format("""
                {
                    "contents": [{
                        "parts": [{
                            "text": "%s"
                        }]
                    }]
                }
                """, prompt.replace("\"", "\\\""));

            String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            String category = parseGeminiResponse(response).trim().toUpperCase();
            return category;
            
        } catch (Exception e) {
            log.error("Error categorizing query: ", e);
            return "GENERAL";
        }
    }

    @Override
    public boolean isServiceAvailable() {
        return geminiApiKey != null && !geminiApiKey.isEmpty();
    }

    private String buildPrompt(String userMessage, ChatContext context) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are a helpful medical assistant for ClinicHub. ");
        prompt.append("Give direct, specific answers with actual location details when available. ");
        prompt.append("Keep responses conversational and under 3 sentences. ");

        // Add conversation history for context
        if (context.getRecentMessages() != null && !context.getRecentMessages().isEmpty()) {
            prompt.append("\n\nPREVIOUS CONVERSATION:\n");
            context.getRecentMessages().forEach(msg -> {
                prompt.append(msg).append("\n");
            });
            prompt.append("\nBased on this conversation, respond naturally.\n\n");
        }

        // Add context based on query type
        if (isLocationQuery(userMessage)) {
            prompt.append("The user is asking about locations. Provide specific addresses, cities, and contact details from the available data. ");
            prompt.append("If you have branch location information, include full addresses with pincode. ");
        } else if (isAddressQuery(userMessage)) {
            prompt.append("The user wants full address details. Provide complete address including location, city, pincode from the available branch data. ");
        } else if (isSymptomQuery(userMessage)) {
            prompt.append("The user is describing symptoms. Recommend appropriate doctors and specializations. ");
        } else if (isAvailabilityQuery(userMessage)) {
            prompt.append("The user wants appointment information. Provide available doctors and help with booking. ");
        } else if (isDoctorSpecificQuery(userMessage)) {
            prompt.append("The user is asking about a specific doctor. Use the provided doctor information including location and specialization. ");
        }

        // Add available data context
        if (context.getAvailableDoctors() != null && !context.getAvailableDoctors().isEmpty()) {
            prompt.append("\nAVAILABLE DOCTORS: ").append(context.getAvailableDoctors()).append("\n");
        }
        
        if (context.getAvailableClinics() != null && !context.getAvailableClinics().isEmpty()) {
            prompt.append("AVAILABLE CLINICS: ").append(context.getAvailableClinics()).append("\n");
        }
        
        if (context.getSpecializations() != null && !context.getSpecializations().isEmpty()) {
            prompt.append("SPECIALIZATIONS: ").append(context.getSpecializations()).append("\n");
        }

        if (context.getContextSummary() != null && !context.getContextSummary().isEmpty()) {
            prompt.append("LOCATION INFO: ").append(context.getContextSummary()).append("\n");
        }

        prompt.append("\nUSER QUESTION: ").append(userMessage);
        
        // Specific instructions based on query type
        if (isLocationQuery(userMessage) || isAddressQuery(userMessage)) {
            prompt.append("\n\nProvide specific location details from the branch data. ");
            prompt.append("Include clinic names, addresses, cities, and pincodes when available. ");
            prompt.append("Be helpful and specific about locations. ");
        } else if (isDoctorSpecificQuery(userMessage)) {
            prompt.append("\n\nIf you have information about this doctor, share their specialization and exact location. ");
            prompt.append("Remember previous conversation context. ");
        } else {
            prompt.append("\n\nGive a direct, helpful answer in 2-3 sentences. ");
            prompt.append("Reference previous messages naturally if relevant. ");
        }

        return prompt.toString();
    }

    private boolean isAddressQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("address") || lowerMessage.contains("full address") ||
               lowerMessage.contains("complete address") || lowerMessage.contains("exact address");
    }

    private boolean isDoctorSpecificQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("dr.") || lowerMessage.contains("doctor") || 
               lowerMessage.contains("manmath") || lowerMessage.contains("mandal") ||
               lowerMessage.contains("type") || lowerMessage.contains("specialty") ||
               lowerMessage.contains("specialization");
    }

    private boolean isLocationQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("location") || lowerMessage.contains("where") || 
               lowerMessage.contains("near") || lowerMessage.contains("city") || 
               lowerMessage.contains("branch") || lowerMessage.contains("available") ||
               lowerMessage.contains("places") || lowerMessage.contains("balasore") ||
               lowerMessage.contains("in ");
    }

    private boolean isSymptomQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("fever") || lowerMessage.contains("pain") || 
               lowerMessage.contains("headache") || lowerMessage.contains("cough") ||
               lowerMessage.contains("symptom") || lowerMessage.contains("problem") ||
               lowerMessage.contains("hurt") || lowerMessage.contains("sick") ||
               lowerMessage.contains("rash") || lowerMessage.contains("ache");
    }

    private boolean isAvailabilityQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("available") || lowerMessage.contains("appointment") || 
               lowerMessage.contains("book") || lowerMessage.contains("schedule") ||
               lowerMessage.contains("slot") || lowerMessage.contains("time") ||
               lowerMessage.contains("when") || lowerMessage.contains("today");
    }

    private String parseGeminiResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode text = parts.get(0).get("text");
                        if (text != null) {
                            return text.asText();
                        }
                    }
                }
            }
            return "Sorry, I couldn't understand that. Can you try asking differently?";
        } catch (Exception e) {
            log.error("Error parsing Gemini response: ", e);
            return "I'm having trouble understanding. Please try again.";
        }
    }
}
