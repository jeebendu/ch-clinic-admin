
package com.jee.clinichub.app.core.mail.smtp.service;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.mail.MailService;
import com.jee.clinichub.app.core.mail.smtp.config.SmtpConfiguration;

import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.mail.Authenticator;
import jakarta.mail.BodyPart;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.extern.log4j.Log4j2;


@Log4j2
@Service
public class SmtpServiceImpl implements MailService, ApplicationListener<MailRequest>{
	
	private final static Logger LOGGER = LoggerFactory.getLogger(SmtpServiceImpl.class);

	private final SmtpConfiguration smtpConfig;

	public SmtpServiceImpl(SmtpConfiguration smtpConfig) {
		this.smtpConfig = smtpConfig;
	}
	
	@Override
	public void onApplicationEvent(MailRequest mailRequest) {
		log.info("Email request received: " + mailRequest.toString());
		sendMail(mailRequest);
	}

	@Override
	public boolean sendMail(MailRequest mailRequest) {
		
		  try {
			  
			  Properties props = new Properties();
		        props.put("mail.smtp.auth", "true");
		        props.put("mail.smtp.starttls.enable", "true");
		        props.put("mail.smtp.host", smtpConfig.getHost());
		        props.put("mail.smtp.port", smtpConfig.getPort());
		        
		        // Get the Session object.
		        Session session = Session.getInstance(props,
		        new Authenticator() {
		           protected PasswordAuthentication getPasswordAuthentication() {
		              return new PasswordAuthentication(smtpConfig.getUsername(), smtpConfig.getPassword());
		           }
		        });

	            Message message = new MimeMessage(session);
	            message.setFrom(new InternetAddress(mailRequest.getFrom()));
	            message.setRecipients(
	                    Message.RecipientType.TO,
	                    InternetAddress.parse(mailRequest.getTo())
	            );
	            message.setSubject(mailRequest.getSubject());

	            if (mailRequest.hasAttachment()) {
	                // Create multipart message
	                Multipart multipart = new MimeMultipart();
	                
	                // Create text part
	                BodyPart messageBodyPart = new MimeBodyPart();
	                messageBodyPart.setContent(mailRequest.getContent(), "text/html");
	                multipart.addBodyPart(messageBodyPart);
	                
	                // Create attachment part
	                MimeBodyPart attachmentPart = new MimeBodyPart();
	                DataSource source = new ByteArrayDataSource(
	                    mailRequest.getAttachmentData(), 
	                    mailRequest.getAttachmentContentType()
	                );
	                attachmentPart.setDataHandler(new DataHandler(source));
	                attachmentPart.setFileName(mailRequest.getAttachmentName());
	                multipart.addBodyPart(attachmentPart);
	                
	                message.setContent(multipart);
	            } else {
	                message.setContent(mailRequest.getContent(), "text/html");
	            }

	            Transport.send(message);

	            log.info("Mail Sent Successfully");
	            return true;

	        } catch (MessagingException e) {
	            LOGGER.error("Error sending email", e);
	            e.printStackTrace();
	        }
		  return false;
	}
}
