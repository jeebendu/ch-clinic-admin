
package com.jee.clinichub.app.appointment.appointments.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.google.zxing.WriterException;
import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.mail.MailService;
import com.jee.clinichub.app.core.qrcode.QRCodeGenerator;
import com.jee.clinichub.app.core.sms.SmsRequest;
import com.jee.clinichub.app.core.sms.SmsService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentNotificationService {
	
	@Value("${mail.from}")
	private String fromEmail;

	@Value("${app.default-tenant}")
	private String defaultTenant;

	private static final String OTP_EMAIL_SUBJECT = "Appointment Confirmation";

	private final MailService mailService;
	private final TemplateEngine templateEngine;
	private final SmsService smsService;
	private final TemplateEngine htmlTemplateEngine;
	private final CDNProviderService cdnProviderService;
	private final QRCodeGenerator qrCodeGenerator;
	private final ClinicMasterRepository clinicMasterRepository;


	
	public void sendAppointmentConfirmEmail(Appointments appointment, byte[] pdfData) {
		try {
			if (appointment.getPatient().getUser().getEmail() != null) {
				String userMail = appointment.getPatient().getUser().getEmail();
				Context context = new Context();
				context.setVariable("patientName",
						appointment.getPatient().getFirstname() + " " + appointment.getPatient().getLastname());

				context.setVariable("bookingId",
						appointment.getBookingId() != null ? appointment.getBookingId() : "bookingid");
				context.setVariable("clinic", appointment.getDoctorBranch().getBranch().getClinic().getName());
				context.setVariable("branch", appointment.getDoctorBranch().getBranch().getName());
				context.setVariable("branchAddress", appointment.getDoctorBranch().getBranch().getCity() + ","
						+ appointment.getDoctorBranch().getBranch().getLocation());

				SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd");
				context.setVariable("slotDate", dateFormater.format(appointment.getSlot().getDate()));

				context.setVariable("doctor", appointment.getDoctorBranch().getDoctor().getFirstname() + " "
						+ appointment.getDoctorBranch().getDoctor().getLastname());

				DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
				String formattedTime = appointment.getExpectedTime().format(timeFormatter);
				context.setVariable("expectedTime", formattedTime);

				context.setVariable("duration", appointment.getSlot().getDuration());

				String emailBody = templateEngine.process("appointment-confirm-email", context);

				MailRequest mailRequest = new MailRequest(this, fromEmail, userMail, OTP_EMAIL_SUBJECT, emailBody);
				// Add PDF attachment
				if (pdfData != null && pdfData.length > 0) {
					mailRequest.setAttachmentData(pdfData);
					mailRequest.setAttachmentName("appointment-confirmation.pdf");
					mailRequest.setAttachmentContentType("application/pdf");
				}

				mailService.sendMail(mailRequest);
			}
			// Send WhatsApp message with PDF and location
			if (appointment.getPatient().getUser().getPhone() != null) {
				try {
					
					sendWhatsAppWithPdfAndLocation(appointment, pdfData);
					
				} catch (Exception e) {
					log.error("Failed to send WhatsApp message: ", e);
					// Fallback to SMS
					String message = this.buildAppointmentMesssage(appointment);
					smsService.sendSms(new SmsRequest(appointment.getPatient().getUser().getPhone(), message));
				}
			}
		} catch (Exception e) {
			log.error("Something went wrong while sending confirmmation mail");
		}
	}
	
	
	public String buildAppointmentMesssage(Appointments appointment) {
	    StringBuilder message = new StringBuilder();
	
	    String patientName = appointment.getFamilyMember() != null
	            ? appointment.getFamilyMember().getName()
	            : appointment.getPatient().getFirstname();
	
	    String doctorName = appointment.getDoctorBranch().getDoctor().getFirstname() + " " +
	                        appointment.getDoctorBranch().getDoctor().getLastname();
	
	    String branchName = appointment.getDoctorBranch().getBranch().getName();
	    String clinicName = appointment.getDoctorBranch().getBranch().getClinic().getName();
	
	    String slotDate = appointment.getSlot().getDate().toString();
	    String slotTime = appointment.getSlot().getStartTime() + " - " + appointment.getSlot().getEndTime();
	
	    message.append("Dear ").append(patientName).append(",\n\n");
	    message.append("Your appointment has been successfully booked!\n\n");
	    message.append("🆔 Booking ID: ").append(appointment.getBookingId()).append("\n");
	    message.append("📅 Date: ").append(slotDate).append("\n");
	    message.append("⏰ Time: ").append(slotTime).append("\n");
	    message.append("👨‍⚕️ Doctor: Dr. ").append(doctorName).append("\n");
	    message.append("🏥 Clinic: ").append(clinicName).append("\n");
	    message.append("📍 Branch: ").append(branchName).append("\n");
	    
	    // Add Google Maps location link
	    String mapsUrl = buildGoogleMapsUrl(appointment.getDoctorBranch().getBranch());
	    if (mapsUrl != null) {
	        message.append("🗺️ Location: ").append(mapsUrl).append("\n");
	    }
	    
	    message.append("\nPlease arrive 30 minutes early. We look forward to seeing you!");
	
	    return message.toString();
	}
	
	public void sendWhatsAppWithPdfAndLocation(Appointments appointment, byte[] pdfData) {
	    try {
	        String phoneNumber = appointment.getPatient().getUser().getPhone();
	        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
	            return;
	        }
	        
	        // Build enhanced message with location
	        String message = buildAppointmentMesssage(appointment);
	        
	        // Upload PDF to Cloudinary if available
	        if (pdfData != null && pdfData.length > 0) {
	            String pdfUrl = uploadPdfToCloudinary(pdfData, appointment.getBookingId());
	            
	            if (pdfUrl != null) {
	                // Send media message with PDF
	                String mediaMessage = message + "\n\n📄 Download your appointment confirmation: " + pdfUrl;
	                smsService.sendMediaMessage(phoneNumber, message, pdfUrl);
	                log.info("WhatsApp media message sent successfully to {}", phoneNumber);
	            } else {
	                // Fallback to text message if PDF upload failed
	            	smsService.sendWhatsapp(new SmsRequest(phoneNumber, message));
	                log.info("WhatsApp text message sent successfully to {}", phoneNumber);
	            }
	        } else {
	            // Send text message only
	        	smsService.sendWhatsapp(new SmsRequest(phoneNumber, message));
	            log.info("WhatsApp text message sent successfully to {}", phoneNumber);
	        }
	        
	    } catch (Exception e) {
	        log.error("Failed to send WhatsApp message: ", e);
	        throw e; // Re-throw to trigger SMS fallback
	    }
	}

	
	public String generateAppointmentHtml(Appointments appointment) {
	    try {
	        final Context ctx = new Context(LocaleContextHolder.getLocale());
	        
	     // Main SaaS logo – if fixed, else leave empty
	        ctx.setVariable("mainLogoUrl", "https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png");

	        // Tenant logo – fallback to empty if not available
	        String tenantLogoUrl = Optional.ofNullable(appointment.getDoctorBranch().getBranch().getClinic().getLogo())
	            .orElse("https://www.aarohclinic.com/assets/images/page-title/logo.png");
	        ctx.setVariable("tenantLogoUrl", tenantLogoUrl);

	        // Patient Info
	        String patientName = appointment.getFamilyMember() != null
	            ? appointment.getFamilyMember().getName()
	            : appointment.getPatient().getFirstname() + " " + appointment.getPatient().getLastname();
	        ctx.setVariable("patientName", patientName);

	        String bookedBy = appointment.getFamilyMember() != null
	            ? appointment.getPatient().getFirstname() + " " + appointment.getPatient().getLastname()
	            : "Myself";
	        ctx.setVariable("bookedBy", bookedBy);

	        String patientPhone = appointment.getFamilyMember() != null
	            ? Optional.ofNullable(appointment.getFamilyMember().getPhone()).orElse("")
	            : Optional.ofNullable(appointment.getPatient().getUser().getPhone()).orElse("");
	        ctx.setVariable("patientPhone", patientPhone);

	        String patientEmail = Optional.ofNullable(appointment.getPatient().getUser().getEmail()).orElse("");
	        ctx.setVariable("patientEmail", patientEmail);

	        String patientAgeGender = appointment.getFamilyMember() != null
	            ? String.format("%s / %s",
	                Optional.ofNullable(appointment.getFamilyMember().getAge()).orElse(0),
	                Optional.ofNullable(appointment.getFamilyMember().getGender()).orElse("N/A"))
	            : String.format("%s / %s",
	                Optional.ofNullable(appointment.getPatient().getAge()).orElse(0),
	                Optional.ofNullable(appointment.getPatient().getGender()).orElse("N/A"));
	        ctx.setVariable("patientAgeGender", patientAgeGender);

	        // Appointment Info
	        ctx.setVariable("bookingId", Optional.ofNullable(appointment.getBookingId()).orElse("N/A"));

	        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
	        ctx.setVariable("appointmentDate", dateFormatter.format(appointment.getSlot().getDate()));

	        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
	        ctx.setVariable("appointmentTime", appointment.getExpectedTime().format(timeFormatter));

	        ctx.setVariable("appointmentDuration", appointment.getSlot().getDuration());

	        SimpleDateFormat bookingTimeFormatter = new SimpleDateFormat("yyyy-MM-dd hh:mm a");
	        ctx.setVariable("bookingTime", bookingTimeFormatter.format(appointment.getCreatedTime()));

	        // Doctor Info
	        String doctorName = appointment.getDoctorBranch().getDoctor().getFirstname() + " " +
	                            appointment.getDoctorBranch().getDoctor().getLastname();
	        ctx.setVariable("doctorName", doctorName);

	        // Clinic Info
	        ctx.setVariable("clinicName", appointment.getDoctorBranch().getBranch().getClinic().getName());
	        ctx.setVariable("branchName", appointment.getDoctorBranch().getBranch().getName());
	        String branchAddress = appointment.getDoctorBranch().getBranch().getLocation() + ", " +
	                               appointment.getDoctorBranch().getBranch().getCity();
	        ctx.setVariable("branchAddress", branchAddress);

	        ctx.setVariable("clinicContact", Optional.ofNullable(appointment.getDoctorBranch().getBranch().getClinic().getContact()).orElse(""));
	        ctx.setVariable("clinicEmail", Optional.ofNullable(appointment.getDoctorBranch().getBranch().getClinic().getEmail()).orElse(""));

	        // QR Codes
	        ctx.setVariable("appointmentQrImage", generateAppointmentQRCode(appointment));
	        ctx.setVariable("locationQrImage", generateLocationQRCode(appointment.getDoctorBranch().getBranch().getMapurl()));

	        return htmlTemplateEngine.process("patient/appointment/appointmentForm.html", ctx);

	    } catch (Exception e) {
	        log.error("Something went wrong while generating HTML", e);
	        return null;
	    }
	}

	 



	private String generateLocationQRCode(String locationUrl) {
		try {
			return qrCodeGenerator.generateQRCodeImage(locationUrl);
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return locationUrl;
	}


	/**
	 * Upload PDF to Cloudinary with UUID-based filename for security
	 */
	private String uploadPdfToCloudinary(byte[] pdfData, String appointmentId) {
	    try {
	        if (pdfData == null || pdfData.length == 0 ) {
	            return null;
	        }
	        
	        // Generate UUID-based filename for security
	        String fileName = "appointment-" + UUID.randomUUID().toString() + ".pdf";
	        String folderPath = "appointments/" + fileName;
	        
	       
	        // Upload to Cloudinary
	        String publicUrl = cdnProviderService.upload(pdfData,fileName, folderPath);
	        
	        log.info("PDF uploaded to Cloudinary successfully: {}", publicUrl);
	        return publicUrl;
	        
	    } catch (Exception e) {
	        log.error("Failed to upload PDF to Cloudinary: ", e);
	        return null;
	    }
	}

	/**
	 * Build Google Maps URL from branch coordinates
	 */
	private String buildGoogleMapsUrl(Branch branch) {
	    try {
	        if (branch.getLatitude() != null && branch.getLongitude() != null) {
	            // Create Google Maps URL with coordinates
	            String mapsUrl = String.format(
	                "https://www.google.com/maps?q=%f,%f&z=17",
	                branch.getLatitude(),
	                branch.getLongitude()
	            );
	            
	            // Add branch name as a label
	            if (branch.getName() != null && !branch.getName().trim().isEmpty()) {
	                mapsUrl += "(" + branch.getName().replaceAll("[^a-zA-Z0-9\\s]", "") + ")";
	            }
	            
	            return mapsUrl; 
	        }
	        return null;
	    } catch (Exception e) {
	        log.error("Failed to build Google Maps URL: ", e);
	        return null;
	    }
	}
	  
	/**
     * Generate QR code for location with Google Maps URL
     */
    public String generateLocationQRCode(String clinicName, String address, Double latitude, Double longitude) {
        try {
            String locationUrl;
            if (latitude != null && longitude != null) {
                locationUrl = String.format("https://www.google.com/maps?q=%f,%f&z=17(%s)", 
                    latitude, longitude, clinicName);
            } else {
                locationUrl = String.format("https://www.google.com/maps/search/?api=1&query=%s,%s", 
                    clinicName, address);
            }
            
            String base64Logo = qrCodeGenerator.generateQRCodeImage(locationUrl);
            log.info(base64Logo);
            return base64Logo; // returns base64 PNG
        } catch (Exception e) {
            log.error("Error generating location QR code: {}", e.getMessage());
            return null;
        }
    }
   
    public String generateAppointmentQRCode(Appointments appointment) {
        try { 
        	String tenantId = "";
        	Clinic clinic = appointment.getDoctorBranch().getBranch().getClinic();
        	Optional<ClinicMaster> clinicMasterOptional = clinicMasterRepository.findById(clinic.getId());
        	if(clinicMasterOptional.isPresent()) { 
        		ClinicMaster clinicMaster = clinicMasterOptional.get();
        		tenantId = clinicMaster.getTenant().getClientId();      
        	}
            
        	 
            String branchId = appointment.getDoctorBranch().getBranch().getGlobalBranchId().toString();

            String qrData = String.format(
                "{\"type\":\"appointment\",\"id\":\"%s\",\"tenantId\":\"%s\",\"branchId\":\"%s\"}",
                appointment.getGlobalAppointmentId(), tenantId, branchId
            );
            log.info(qrData); 
            String base64Logo = qrCodeGenerator.generateQRCodeImage(qrData); 
            log.info(base64Logo);
            return base64Logo; // returns base64 PNG
            
        } catch (Exception e) {
            log.error("Error generating appointment QR code: {}", e.getMessage());
            return null; 
        }
    }

    /** 
     * Generate QR code for appointment details
     */
    public String generateAppointmentQRCode(String appointmentId, String bookingId, String date, 
                                          String time, String patientName, String doctorName, 
                                          String clinicName) {
        try {
            String appointmentJson = String.format(
                "{\"type\":\"appointment\",\"id\": \"%s\",\"bookingId\":\"%s\",\"date\":\"%s\",\"time\":\"%s\",\"patient\":\"%s\",\"doctor\":\"%s\",\"clinic\":\"%s\"}", 
                appointmentId, bookingId, date, time, patientName, doctorName, clinicName);
            
           
            String base64Logo = qrCodeGenerator.generateQRCodeImage(appointmentJson); 
            log.info(base64Logo);
            return base64Logo; // returns base64 PNG
        } catch (Exception e) {
            log.error("Error generating appointment QR code: {}", e.getMessage());
            return null;
        }
    }

}
