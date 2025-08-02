package com.jee.clinichub.app.core.sms;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class SmsMediaRequest {
    @NotBlank
    private final String phoneNumber;
    @NotBlank
    private final String message;
    @NotBlank
    private final String mediaUrl;

    public SmsMediaRequest(@JsonProperty("phoneNumber") String phoneNumber,
                          @JsonProperty("message") String message,
                          @JsonProperty("mediaUrl") String mediaUrl) {
        this.phoneNumber = phoneNumber;
        this.message = message;
        this.mediaUrl = mediaUrl;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getMessage() {
        return message;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    @Override
    public String toString() {
        return "SmsMediaRequest{" +
                "phoneNumber='" + phoneNumber + '\'' +
                ", message='" + message + '\'' +
                ", mediaUrl='" + mediaUrl + '\'' +
                '}';
    }
}