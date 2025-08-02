package com.jee.clinichub.app.core.mail;

import org.springframework.context.ApplicationEvent;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MailRequest extends ApplicationEvent{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@NotBlank
	private final String from;
	@NotBlank
	private final String to;
	@NotBlank
	private final String subject;
	@NotBlank
	private final String content;
	
	private byte[] attachmentData;
    private String attachmentName;
    private String attachmentContentType;

	public MailRequest(Object source,@NotBlank String from, @NotBlank String to, @NotBlank String subject, @NotBlank String content) {
		super(source);
		this.from = from;
		this.to = to;
		this.subject = subject;
		this.content = content;
	}
	
	public MailRequest(Object source,
            @NotBlank String from,
            @NotBlank String to,
            @NotBlank String subject,
            @NotBlank String content,
            byte[] attachmentData,
            String attachmentName,
            String attachmentContentType) {
				super(source);
				this.from = from;
				this.to = to;
				this.subject = subject;
				this.content = content;
				this.attachmentData = attachmentData;
				this.attachmentName = attachmentName;
				this.attachmentContentType = attachmentContentType;
			}
	

	public boolean hasAttachment() {
        return attachmentData != null && attachmentData.length > 0;
    }
    
	
	@Override
	public String toString() {
		return "MailRequest [from=" + from + ", to=" + to + ", subject=" + subject + ", content=" + content + "]";
	}

}


