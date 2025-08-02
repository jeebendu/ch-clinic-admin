package com.jee.clinichub.app.aichat.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.aichat.model.ChatContext;
import com.jee.clinichub.app.aichat.model.ChatMessage;
import com.jee.clinichub.app.aichat.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ChatContextService {

    private final ChatMessageRepository chatMessageRepository;
    private final JdbcTemplate jdbcTemplate;

    public ChatContext buildContext(String userMessage, Long sessionId) {
        ChatContext context = new ChatContext();
        context.setUserMessage(userMessage);

        try {
            // Get recent messages for context
            if (sessionId != null) {
                List<ChatMessage> recentMessages = chatMessageRepository
                    .findRecentMessagesBySessionId(sessionId, PageRequest.of(0, 10));
                
                List<String> messageTexts = recentMessages.stream()
                    .map(msg -> {
                        if (msg.getMessageType().toString().equals("USER")) {
                            return "User: " + msg.getMessage();
                        } else {
                            return "Assistant: " + (msg.getResponse() != null ? msg.getResponse() : msg.getMessage());
                        }
                    })
                    .collect(Collectors.toList());
                context.setRecentMessages(messageTexts);
            }

            // Enhanced context building with location-based search
            if (containsLocationQuery(userMessage)) {
                LocationInfo locationInfo = extractLocationInfo(userMessage);
                if (locationInfo.hasCoordinates()) {
                    context.setAvailableDoctors(buildLocationBasedDoctorContextWithDistance(locationInfo));
                    context.setAvailableClinics(buildLocationBasedClinicContextWithDistance(locationInfo));
                    context.setContextSummary(buildLocationContextWithDistance(locationInfo));
                } else {
                    context.setAvailableDoctors(buildLocationBasedDoctorContextFromView(userMessage));
                    context.setAvailableClinics(buildLocationBasedClinicContextFromView(userMessage));
                    context.setContextSummary(buildLocationContextFromView(userMessage));
                }
            }
            else if (containsDoctorNameQuery(userMessage)) {
                context.setAvailableDoctors(buildDoctorSpecificContextFromView(userMessage));
            }
            else if (containsSymptoms(userMessage)) {
                context.setSpecializations(buildSymptomBasedSpecializationContext(userMessage));
                context.setAvailableDoctors(buildSymptomBasedDoctorContextFromView(userMessage));
            }
            else if (containsAvailabilityQuery(userMessage)) {
                context.setContextSummary(buildSlotAvailabilityContextFromView(userMessage));
                context.setAvailableDoctors(buildAvailabilityBasedDoctorContextFromView(userMessage));
            }
            else {
                // Default context using views
                context.setAvailableDoctors(buildDoctorContextFromView());
                context.setAvailableClinics(buildClinicLocationContextFromView());
                context.setSpecializations(buildSpecializationContext());
            }

        } catch (Exception e) {
            log.error("Error building chat context: ", e);
        }

        return context;
    }

    private String buildLocationBasedDoctorContextWithDistance(LocationInfo locationInfo) {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT doctor_name, branch_city, branch_location, clinic_name, 
                       available_slots_count, next_available_date, specializations,
                       consultation_fee, avg_rating, latitude, longitude
                FROM ai_doctor_search_view 
                WHERE available_slots_count > 0
                  AND latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY available_slots_count DESC, avg_rating DESC NULLS LAST
                LIMIT 15
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                double branchLat = rs.getDouble("latitude");
                double branchLon = rs.getDouble("longitude");
                double distance = calculateDistance(locationInfo.latitude, locationInfo.longitude, branchLat, branchLon);
                
                return String.format("%s at %s, %s (%s) - %.1f km away, %d available slots, next available: %s, specializes in: %s, fee: ₹%.0f, rating: %.1f",
                    rs.getString("doctor_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("clinic_name"),
                    distance,
                    rs.getInt("available_slots_count"),
                    rs.getDate("next_available_date") != null ? rs.getDate("next_available_date").toString() : "N/A",
                    rs.getString("specializations") != null ? rs.getString("specializations") : "General",
                    rs.getDouble("consultation_fee"),
                    rs.getDouble("avg_rating") > 0 ? rs.getDouble("avg_rating") : 0.0);
            });
            
            // Sort by distance
            results.sort((a, b) -> {
                Double distA = Double.parseDouble(a.split(" - ")[1].split(" km")[0]);
                Double distB = Double.parseDouble(b.split(" - ")[1].split(" km")[0]);
                return distA.compareTo(distB);
            });
            
            for (String result : results.subList(0, Math.min(8, results.size()))) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No doctors found near your location with available slots.";
                
        } catch (Exception e) {
            log.error("Error building location-based doctor context with distance: ", e);
            return buildDoctorContextFromView();
        }
    }

    private String buildLocationBasedClinicContextWithDistance(LocationInfo locationInfo) {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT clinic_name, branch_name, branch_location, branch_city, 
                       branch_pincode, clinic_contact, doctors_count, available_services,
                       latitude, longitude
                FROM ai_clinic_location_view 
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY doctors_count DESC
                LIMIT 15
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                double branchLat = rs.getDouble("latitude");
                double branchLon = rs.getDouble("longitude");
                double distance = calculateDistance(locationInfo.latitude, locationInfo.longitude, branchLat, branchLon);
                
                return String.format("%s (%s) located at %s, %s - %.1f km away, Pincode: %s, Contact: %s, %d doctors available, Services: %s",
                    rs.getString("clinic_name"),
                    rs.getString("branch_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    distance,
                    rs.getString("branch_pincode"),
                    rs.getString("clinic_contact") != null ? rs.getString("clinic_contact") : "Contact clinic directly",
                    rs.getInt("doctors_count"),
                    rs.getString("available_services") != null ? rs.getString("available_services") : "General services");
            });
            
            // Sort by distance
            results.sort((a, b) -> {
                Double distA = Double.parseDouble(a.split(" - ")[1].split(" km")[0]);
                Double distB = Double.parseDouble(b.split(" - ")[1].split(" km")[0]);
                return distA.compareTo(distB);
            });
            
            for (String result : results.subList(0, Math.min(8, results.size()))) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No clinics found near your location.";
                
        } catch (Exception e) {
            log.error("Error building location-based clinic context with distance: ", e);
            return buildClinicLocationContextFromView();
        }
    }

    private String buildLocationContextWithDistance(LocationInfo locationInfo) {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT clinic_name, branch_name, branch_location, branch_city,
                       branch_pincode, doctors_count, latitude, longitude
                FROM ai_clinic_location_view 
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY doctors_count DESC
                LIMIT 10
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                double branchLat = rs.getDouble("latitude");
                double branchLon = rs.getDouble("longitude");
                double distance = calculateDistance(locationInfo.latitude, locationInfo.longitude, branchLat, branchLon);
                
                return String.format("%s (%s) at %s, %s - %.1f km away, Pincode: %s - %d doctors available",
                    rs.getString("clinic_name"),
                    rs.getString("branch_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    distance,
                    rs.getString("branch_pincode"),
                    rs.getInt("doctors_count"));
            });
            
            // Sort by distance
            results.sort((a, b) -> {
                Double distA = Double.parseDouble(a.split(" - ")[1].split(" km")[0]);
                Double distB = Double.parseDouble(b.split(" - ")[1].split(" km")[0]);
                return distA.compareTo(distB);
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? "Available locations near you: " + context.toString() : 
                "No clinics found near your location.";
                
        } catch (Exception e) {
            log.error("Error building location context with distance: ", e);
            return "Location information temporarily unavailable.";
        }
    }

    private LocationInfo extractLocationInfo(String message) {
        LocationInfo locationInfo = new LocationInfo();
        String lowerMessage = message.toLowerCase();
        
        // Try to extract coordinates (lat,long format)
        String coordPattern = "[-+]?[0-9]*\\.?[0-9]+";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(" + coordPattern + ")\\s*,\\s*(" + coordPattern + ")");
        java.util.regex.Matcher matcher = pattern.matcher(message);
        
        if (matcher.find()) {
            try {
                locationInfo.latitude = Double.parseDouble(matcher.group(1));
                locationInfo.longitude = Double.parseDouble(matcher.group(2));
                return locationInfo;
            } catch (NumberFormatException e) {
                log.warn("Failed to parse coordinates: " + matcher.group(1) + ", " + matcher.group(2));
            }
        }
        
        // Try to extract postal code
        java.util.regex.Pattern pincodePattern = java.util.regex.Pattern.compile("\\b(\\d{6})\\b");
        java.util.regex.Matcher pincodeMatcher = pincodePattern.matcher(message);
        
        if (pincodeMatcher.find()) {
            locationInfo.pincode = pincodeMatcher.group(1);
            // Convert pincode to coordinates using database lookup
            convertPincodeToCoordinates(locationInfo);
            return locationInfo;
        }
        
        // Extract city name
        locationInfo.cityName = extractLocationFromMessage(message);
        // Convert city to coordinates using database lookup
        convertCityToCoordinates(locationInfo);
        
        return locationInfo;
    }

    private void convertPincodeToCoordinates(LocationInfo locationInfo) {
        try {
            String sql = "SELECT latitude, longitude FROM branch WHERE pincode = ? LIMIT 1";
            List<Double[]> coordinates = jdbcTemplate.query(sql, new Object[]{Integer.parseInt(locationInfo.pincode)}, 
                (rs, rowNum) -> new Double[]{rs.getDouble("latitude"), rs.getDouble("longitude")});
            
            if (!coordinates.isEmpty() && coordinates.get(0)[0] != null && coordinates.get(0)[1] != null) {
                locationInfo.latitude = coordinates.get(0)[0];
                locationInfo.longitude = coordinates.get(0)[1];
            }
        } catch (Exception e) {
            log.warn("Failed to convert pincode to coordinates: " + locationInfo.pincode, e);
        }
    }

    private void convertCityToCoordinates(LocationInfo locationInfo) {
        try {
            String sql = "SELECT latitude, longitude FROM branch WHERE LOWER(city) = LOWER(?) LIMIT 1";
            List<Double[]> coordinates = jdbcTemplate.query(sql, new Object[]{locationInfo.cityName}, 
                (rs, rowNum) -> new Double[]{rs.getDouble("latitude"), rs.getDouble("longitude")});
            
            if (!coordinates.isEmpty() && coordinates.get(0)[0] != null && coordinates.get(0)[1] != null) {
                locationInfo.latitude = coordinates.get(0)[0];
                locationInfo.longitude = coordinates.get(0)[1];
            }
        } catch (Exception e) {
            log.warn("Failed to convert city to coordinates: " + locationInfo.cityName, e);
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula to calculate distance between two points on Earth
        final int EARTH_RADIUS = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS * c; // Distance in km
        
        return Math.round(distance * 10.0) / 10.0; // Round to 1 decimal place
    }

    private String buildLocationBasedDoctorContextFromView(String userMessage) {
        try {
            String location = extractLocationFromMessage(userMessage);
            if (location.isEmpty()) {
                return buildDoctorContextFromView();
            }
            
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT doctor_name, branch_city, branch_location, clinic_name, 
                       available_slots_count, next_available_date, specializations,
                       consultation_fee, avg_rating
                FROM ai_doctor_search_view 
                WHERE (LOWER(branch_city) LIKE LOWER(?) OR LOWER(branch_location) LIKE LOWER(?))
                  AND available_slots_count > 0
                ORDER BY available_slots_count DESC, avg_rating DESC NULLS LAST
                LIMIT 8
                """;
            
            String locationPattern = "%" + location + "%";
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{locationPattern, locationPattern}, (rs, rowNum) -> {
                return String.format("%s at %s, %s (%s) - %d available slots, next available: %s, specializes in: %s, fee: ₹%.0f, rating: %.1f",
                    rs.getString("doctor_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("clinic_name"),
                    rs.getInt("available_slots_count"),
                    rs.getDate("next_available_date") != null ? rs.getDate("next_available_date").toString() : "N/A",
                    rs.getString("specializations") != null ? rs.getString("specializations") : "General",
                    rs.getDouble("consultation_fee"),
                    rs.getDouble("avg_rating") > 0 ? rs.getDouble("avg_rating") : 0.0);
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No doctors found in " + location + " with available slots. Please check nearby areas.";
                
        } catch (Exception e) {
            log.error("Error building location-based doctor context from view: ", e);
            return buildDoctorContextFromView();
        }
    }

    private String buildLocationBasedClinicContextFromView(String userMessage) {
        try {
            String location = extractLocationFromMessage(userMessage);
            if (location.isEmpty()) {
                return buildClinicLocationContextFromView();
            }
            
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT clinic_name, branch_name, branch_location, branch_city, 
                       branch_pincode, clinic_contact, doctors_count, available_services
                FROM ai_clinic_location_view 
                WHERE (LOWER(branch_city) LIKE LOWER(?) OR LOWER(branch_location) LIKE LOWER(?))
                ORDER BY doctors_count DESC
                LIMIT 8
                """;
            
            String locationPattern = "%" + location + "%";
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{locationPattern, locationPattern}, (rs, rowNum) -> {
                return String.format("%s (%s) located at %s, %s, Pincode: %s, Contact: %s, %d doctors available, Services: %s",
                    rs.getString("clinic_name"),
                    rs.getString("branch_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("branch_pincode"),
                    rs.getString("clinic_contact") != null ? rs.getString("clinic_contact") : "Contact clinic directly",
                    rs.getInt("doctors_count"),
                    rs.getString("available_services") != null ? rs.getString("available_services") : "General services");
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No clinics found in " + location + ". Please try nearby areas.";
                
        } catch (Exception e) {
            log.error("Error building location-based clinic context from view: ", e);
            return buildClinicLocationContextFromView();
        }
    }

    private String buildDoctorSpecificContextFromView(String userMessage) {
        try {
            String doctorName = extractDoctorName(userMessage);
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT doctor_name, branch_city, branch_location, clinic_name,
                       available_slots_count, next_available_date, next_available_time,
                       specializations, consultation_fee, avg_rating
                FROM ai_doctor_search_view 
                WHERE LOWER(doctor_name) LIKE ?
                ORDER BY available_slots_count DESC
                LIMIT 5
                """;
            
            String doctorPattern = "%" + doctorName.toLowerCase() + "%";
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{doctorPattern}, (rs, rowNum) -> {
                return String.format("%s specializes in %s, available at %s, %s (%s). %d slots available, next appointment: %s at %s. Consultation fee: ₹%.0f, Rating: %.1f",
                    rs.getString("doctor_name"),
                    rs.getString("specializations") != null ? rs.getString("specializations") : "General Medicine",
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("clinic_name"),
                    rs.getInt("available_slots_count"),
                    rs.getDate("next_available_date") != null ? rs.getDate("next_available_date").toString() : "No slots",
                    rs.getTime("next_available_time") != null ? rs.getTime("next_available_time").toString() : "N/A",
                    rs.getDouble("consultation_fee"),
                    rs.getDouble("avg_rating") > 0 ? rs.getDouble("avg_rating") : 0.0);
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No specific information found for " + doctorName + ". Please check the spelling or try another doctor.";
                
        } catch (Exception e) {
            log.error("Error building doctor-specific context from view: ", e);
            return buildDoctorContextFromView();
        }
    }

    private String buildSlotAvailabilityContextFromView(String userMessage) {
        try {
            StringBuilder context = new StringBuilder();
            LocalDate targetDate = extractDateFromMessage(userMessage);
            String location = extractLocationFromMessage(userMessage);

            String sql = """
                SELECT doctor_name, branch_name, branch_city, slot_date, 
                       start_time, available_slots, consultation_fee
                FROM ai_doctor_availability_view 
                WHERE slot_date >= ? 
                  AND (? = '' OR LOWER(branch_city) LIKE ?)
                  AND is_next_week = true
                ORDER BY slot_date, start_time
                LIMIT 15
                """;

            LocalDate searchDate = targetDate != null ? targetDate : LocalDate.now();
            String locationPattern = location.isEmpty() ? "" : "%" + location.toLowerCase() + "%";
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{searchDate, location, locationPattern}, (rs, rowNum) -> {
                return String.format("%s available on %s at %s in %s, %s (%d slots, ₹%.0f)",
                    rs.getString("doctor_name"),
                    rs.getDate("slot_date").toString(),
                    rs.getTime("start_time").toString(),
                    rs.getString("branch_name"),
                    rs.getString("branch_city"),
                    rs.getInt("available_slots"),
                    rs.getDouble("consultation_fee"));
            });

            for (String result : results) {
                context.append(result).append("; ");
            }

            return context.length() > 0 ? "Available appointments: " + context.toString() : 
                "No available slots found for the specified date and location.";
                
        } catch (Exception e) {
            log.error("Error building slot availability context from view: ", e);
            return "Availability information temporarily unavailable.";
        }
    }

    private String buildSymptomBasedDoctorContextFromView(String userMessage) {
        try {
            String symptoms = userMessage.toLowerCase();
            StringBuilder context = new StringBuilder();
            List<String> relevantSpecializations = getRelevantSpecializations(symptoms);
            
            if (!relevantSpecializations.isEmpty()) {
                String specializationFilter = relevantSpecializations.stream()
                    .map(spec -> "LOWER(specializations) LIKE '%" + spec.toLowerCase() + "%'")
                    .collect(Collectors.joining(" OR "));
                
                String sql = String.format("""
                    SELECT doctor_name, branch_city, branch_location, clinic_name,
                           available_slots_count, next_available_date, specializations,
                           consultation_fee, avg_rating
                    FROM ai_doctor_search_view 
                    WHERE (%s) AND available_slots_count > 0
                    ORDER BY available_slots_count DESC, avg_rating DESC NULLS LAST
                    LIMIT 8
                    """, specializationFilter);
                
                List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                    return String.format("%s (%s) at %s, %s (%s) - %d available slots, next: %s, fee: ₹%.0f, rating: %.1f",
                        rs.getString("doctor_name"),
                        rs.getString("specializations"),
                        rs.getString("branch_location"),
                        rs.getString("branch_city"),
                        rs.getString("clinic_name"),
                        rs.getInt("available_slots_count"),
                        rs.getDate("next_available_date") != null ? rs.getDate("next_available_date").toString() : "N/A",
                        rs.getDouble("consultation_fee"),
                        rs.getDouble("avg_rating") > 0 ? rs.getDouble("avg_rating") : 0.0);
                });
                
                for (String result : results) {
                    context.append(result).append("; ");
                }
            }
            
            return context.length() > 0 ? "Recommended doctors for your symptoms: " + context.toString() : 
                "Please describe your symptoms more specifically for better recommendations.";
                
        } catch (Exception e) {
            log.error("Error building symptom-based doctor context from view: ", e);
            return "Unable to analyze symptoms at the moment.";
        }
    }

    private String buildAvailabilityBasedDoctorContextFromView(String userMessage) {
        try {
            StringBuilder context = new StringBuilder();
            LocalDate targetDate = extractDateFromMessage(userMessage);
            
            String sql = """
                SELECT doctor_name, branch_city, branch_location, clinic_name,
                       available_slots_count, next_available_date, specializations,
                       consultation_fee
                FROM ai_doctor_search_view 
                WHERE available_slots_count > 0
                  AND (next_available_date >= ? OR next_available_date IS NULL)
                ORDER BY available_slots_count DESC, next_available_date
                LIMIT 10
                """;
            
            LocalDate searchDate = targetDate != null ? targetDate : LocalDate.now();
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{searchDate}, (rs, rowNum) -> {
                return String.format("%s at %s, %s (%s) - %d slots available, next: %s, specializes in: %s, fee: ₹%.0f",
                    rs.getString("doctor_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("clinic_name"),
                    rs.getInt("available_slots_count"),
                    rs.getDate("next_available_date") != null ? rs.getDate("next_available_date").toString() : "Soon",
                    rs.getString("specializations") != null ? rs.getString("specializations") : "General",
                    rs.getDouble("consultation_fee"));
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : 
                "No doctors currently available for the specified date.";
                
        } catch (Exception e) {
            log.error("Error building availability-based doctor context from view: ", e);
            return buildDoctorContextFromView();
        }
    }

    private String buildLocationContextFromView(String userMessage) {
        try {
            String location = extractLocationFromMessage(userMessage);
            if (location.isEmpty()) {
                return buildClinicLocationContextFromView();
            }
            
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT clinic_name, branch_name, branch_location, branch_city,
                       branch_pincode, doctors_count
                FROM ai_clinic_location_view 
                WHERE (LOWER(branch_city) LIKE LOWER(?) OR LOWER(branch_location) LIKE LOWER(?))
                ORDER BY doctors_count DESC
                LIMIT 10
                """;
            
            String locationPattern = "%" + location + "%";
            
            List<String> results = jdbcTemplate.query(sql, new Object[]{locationPattern, locationPattern}, (rs, rowNum) -> {
                return String.format("%s (%s) at %s, %s, Pincode: %s - %d doctors available",
                    rs.getString("clinic_name"),
                    rs.getString("branch_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getString("branch_pincode"),
                    rs.getInt("doctors_count"));
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? "Available locations in " + location + ": " + context.toString() : 
                "No clinics found in " + location + ".";
                
        } catch (Exception e) {
            log.error("Error building location context from view: ", e);
            return "Location information temporarily unavailable.";
        }
    }

    private String buildDoctorContextFromView() {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT doctor_name, branch_city, specializations, available_slots_count
                FROM ai_doctor_search_view 
                WHERE available_slots_count > 0
                ORDER BY available_slots_count DESC
                LIMIT 10
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                return String.format("%s in %s (%s) - %d slots available",
                    rs.getString("doctor_name"),
                    rs.getString("branch_city"),
                    rs.getString("specializations") != null ? rs.getString("specializations") : "General",
                    rs.getInt("available_slots_count"));
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : "No doctors currently available.";
            
        } catch (Exception e) {
            log.error("Error building doctor context from view: ", e);
            return "Doctor information temporarily unavailable.";
        }
    }

    private String buildClinicLocationContextFromView() {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT clinic_name, branch_city, branch_location, doctors_count
                FROM ai_clinic_location_view 
                ORDER BY doctors_count DESC
                LIMIT 10
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                return String.format("%s at %s, %s (%d doctors)",
                    rs.getString("clinic_name"),
                    rs.getString("branch_location"),
                    rs.getString("branch_city"),
                    rs.getInt("doctors_count"));
            });
            
            for (String result : results) {
                context.append(result).append("; ");
            }
            
            return context.length() > 0 ? context.toString() : "No clinics currently available.";
            
        } catch (Exception e) {
            log.error("Error building clinic location context from view: ", e);
            return "Clinic information temporarily unavailable.";
        }
    }

    private String buildSpecializationContext() {
        try {
            StringBuilder context = new StringBuilder();
            
            String sql = """
                SELECT DISTINCT specializations
                FROM ai_doctor_search_view 
                WHERE specializations IS NOT NULL
                LIMIT 15
                """;
            
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
                return rs.getString("specializations");
            });
            
            for (String specs : results) {
                if (specs != null) {
                    context.append(specs).append("; ");
                }
            }
            
            return context.length() > 0 ? context.toString() : "General Medicine; Cardiology; Orthopedics; Dermatology; ";
            
        } catch (Exception e) {
            log.error("Error building specialization context: ", e);
            return "Specialization information temporarily unavailable.";
        }
    }

    private String buildSymptomBasedSpecializationContext(String userMessage) {
        try {
            String symptoms = userMessage.toLowerCase();
            StringBuilder context = new StringBuilder("Based on symptoms mentioned, relevant specializations: ");
            
            if (symptoms.contains("skin") || symptoms.contains("rash") || symptoms.contains("acne")) {
                context.append("Dermatology; ");
            }
            if (symptoms.contains("heart") || symptoms.contains("chest pain") || symptoms.contains("cardiac")) {
                context.append("Cardiology; ");
            }
            if (symptoms.contains("bone") || symptoms.contains("joint") || symptoms.contains("muscle")) {
                context.append("Orthopedics; ");
            }
            if (symptoms.contains("eye") || symptoms.contains("vision") || symptoms.contains("sight")) {
                context.append("Ophthalmology; ");
            }
            if (symptoms.contains("fever") || symptoms.contains("cold") || symptoms.contains("cough")) {
                context.append("General Medicine; ");
            }
            
            return context.toString();
        } catch (Exception e) {
            log.error("Error building symptom-based specialization context: ", e);
            return buildSpecializationContext();
        }
    }

    private LocalDate extractDateFromMessage(String message) {
        String lowerMessage = message.toLowerCase();
        
        if (lowerMessage.contains("today")) {
            return LocalDate.now();
        } else if (lowerMessage.contains("tomorrow")) {
            return LocalDate.now().plusDays(1);
        } else if (lowerMessage.contains("monday")) {
            return getNextWeekday(1);
        } else if (lowerMessage.contains("tuesday")) {
            return getNextWeekday(2);
        } else if (lowerMessage.contains("wednesday")) {
            return getNextWeekday(3);
        } else if (lowerMessage.contains("thursday")) {
            return getNextWeekday(4);
        } else if (lowerMessage.contains("friday")) {
            return getNextWeekday(5);
        } else if (lowerMessage.contains("saturday")) {
            return getNextWeekday(6);
        } else if (lowerMessage.contains("sunday")) {
            return getNextWeekday(7);
        }
        
        return null;
    }

    private LocalDate getNextWeekday(int dayOfWeek) {
        LocalDate today = LocalDate.now();
        int currentDay = today.getDayOfWeek().getValue();
        int daysToAdd = (dayOfWeek - currentDay + 7) % 7;
        if (daysToAdd == 0) daysToAdd = 7;
        return today.plusDays(daysToAdd);
    }

    private List<String> getRelevantSpecializations(String symptoms) {
        List<String> specializations = List.of();
        
        if (symptoms.contains("skin") || symptoms.contains("rash") || symptoms.contains("acne")) {
            specializations = List.of("Dermatology", "Skin");
        } else if (symptoms.contains("heart") || symptoms.contains("chest pain") || symptoms.contains("cardiac")) {
            specializations = List.of("Cardiology", "Heart");
        } else if (symptoms.contains("bone") || symptoms.contains("joint") || symptoms.contains("muscle")) {
            specializations = List.of("Orthopedics", "Orthopedic");
        } else if (symptoms.contains("eye") || symptoms.contains("vision") || symptoms.contains("sight")) {
            specializations = List.of("Ophthalmology", "Eye");
        } else if (symptoms.contains("fever") || symptoms.contains("cold") || symptoms.contains("cough")) {
            specializations = List.of("General Medicine", "Internal Medicine");
        }
        
        return specializations;
    }

    private String extractLocationFromMessage(String message) {
        String lowerMessage = message.toLowerCase().trim();
        
        // Check for direct city name matches
        String[] knownCities = {"bhadrak", "balasore", "baripada", "bhubaneswar", "cuttack", "puri", "rourkela", "sambalpur", "berhampur"};
        for (String city : knownCities) {
            if (lowerMessage.contains(city)) {
                return city;
            }
        }
        
        // Common location indicators
        String[] locationWords = {"in", "at", "near", "around", "from", "available"};
        String[] words = lowerMessage.split("\\s+");
        
        for (int i = 0; i < words.length; i++) {
            for (String indicator : locationWords) {
                if (words[i].equals(indicator) && i + 1 < words.length) {
                    String nextWord = words[i + 1].replaceAll("[^a-zA-Z]", "");
                    if (nextWord.length() > 2) {
                        return nextWord;
                    }
                }
            }
        }
        
        return "";
    }

    private boolean containsDoctorNameQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("dr.") || lowerMessage.contains("doctor") || 
               lowerMessage.contains("manmath") || lowerMessage.contains("mandal") ||
               (lowerMessage.matches(".*\\b[a-z]+ [a-z]+\\b.*") && !lowerMessage.contains("find"));
    }

    private boolean containsLocationQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("location") || lowerMessage.contains("where") || 
               lowerMessage.contains("near") || lowerMessage.contains("available") ||
               lowerMessage.contains("city") || lowerMessage.contains("branch") ||
               lowerMessage.contains("address") || lowerMessage.contains("places") ||
               lowerMessage.contains("bhadrak") || lowerMessage.contains("balasore") ||
               lowerMessage.contains("in ") || lowerMessage.contains("at ") ||
               lowerMessage.contains("pincode") || lowerMessage.contains("postal") ||
               lowerMessage.matches(".*\\d{6}.*") || // Contains 6-digit pincode
               lowerMessage.matches(".*[-+]?[0-9]*\\.?[0-9]+\\s*,\\s*[-+]?[0-9]*\\.?[0-9]+.*"); // Contains coordinates
    }

    private boolean containsSymptoms(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("fever") || lowerMessage.contains("pain") || 
               lowerMessage.contains("headache") || lowerMessage.contains("cough") ||
               lowerMessage.contains("symptom") || lowerMessage.contains("problem") ||
               lowerMessage.contains("issue") || lowerMessage.contains("hurt");
    }

    private boolean containsAvailabilityQuery(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("available") || lowerMessage.contains("appointment") || 
               lowerMessage.contains("book") || lowerMessage.contains("schedule") ||
               lowerMessage.contains("slot") || lowerMessage.contains("time");
    }

    private String extractDoctorName(String message) {
        String cleanedMessage = message.toLowerCase()
            .replace("dr.", "")
            .replace("doctor", "")
            .replace("which type", "")
            .replace("he is", "")
            .replace("she is", "")
            .trim();
        
        return cleanedMessage.split("\\s+")[0];
    }

    // Inner class for location information
    private static class LocationInfo {
        Double latitude;
        Double longitude;
        String pincode;
        String cityName;
        
        public boolean hasCoordinates() {
            return latitude != null && longitude != null;
        }
    }
}
