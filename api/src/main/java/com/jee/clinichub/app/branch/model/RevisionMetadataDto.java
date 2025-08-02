package com.jee.clinichub.app.branch.model;

import java.util.Date;

import org.hibernate.Hibernate;
import org.springframework.data.history.RevisionMetadata;

import lombok.Data;

@Data
public class RevisionMetadataDto {
    private String revisionType;
    private Date revisionDate;
    private Long revisionNumber;
    private String revisionInstant;
    private String requiredRevisionInstant;
    private Long requiredRevisionNumber;

    public RevisionMetadataDto(RevisionMetadata<Long> metadata) {
        if (metadata != null) {
            // Unproxy the metadata if it's a proxy
            RevisionMetadata<Long> unproxiedMetadata = (RevisionMetadata<Long>) Hibernate.unproxy(metadata);

            // Now you can safely access the unproxiedMetadata properties
            //this.revisionNumber = unproxiedMetadata.getRevisionNumber().orElse(null);
            // Continue with other initializations as needed
   
        }
    }

}