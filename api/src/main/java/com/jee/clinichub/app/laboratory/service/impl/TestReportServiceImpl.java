package com.jee.clinichub.app.laboratory.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.font.FontProvider;
import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.qrcode.QRCodeGenerator;
import com.jee.clinichub.app.laboratory.model.TestReport;
import com.jee.clinichub.app.laboratory.model.TestReportDTO;
import com.jee.clinichub.app.laboratory.model.TestResult;
import com.jee.clinichub.app.laboratory.model.TestResultDTO;
import com.jee.clinichub.app.laboratory.model.TestType;
import com.jee.clinichub.app.laboratory.repository.TestParameterRepository;
import com.jee.clinichub.app.laboratory.repository.TestReportRepository;
import com.jee.clinichub.app.laboratory.repository.TestResultRepository;
import com.jee.clinichub.app.laboratory.repository.TestTypeRepository;
import com.jee.clinichub.app.laboratory.service.TestReportService;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.patient.service.PatientService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.Base64Converter;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@Transactional
public class TestReportServiceImpl implements TestReportService {

    @Autowired
    private TestReportRepository testReportRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private TestTypeRepository testTypeRepository;

    @Autowired
    private TestParameterRepository testParameterRepository;

    @Autowired
    private TemplateEngine templateEngine;
    
    @Autowired PatientService  patientService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired private QRCodeGenerator qrCodeGenerator;
    
    @Override
    public List<TestReportDTO> getAllReports() {
        return testReportRepository.findAll().stream()
                .map(TestReportDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TestReportDTO> getAllReports(Pageable pageable) {
        Page<TestReport> reports = testReportRepository.findAll(pageable);
        List<TestReportDTO> reportDTOs = reports.getContent().stream()
                .map(TestReportDTO::new)
                .collect(Collectors.toList());
        return new PageImpl<>(reportDTOs, pageable, reports.getTotalElements());
    }

    @Override
    public TestReportDTO getReportById(Long id) {
        Optional<TestReport> report = testReportRepository.findById(id);
        return report.map(TestReportDTO::new).orElse(null);
    }
 
    @Override
    public TestReportDTO getReportByIdWithResults(Long id) {
        TestReport report = testReportRepository.findByIdWithResults(id);
        return report != null ? new TestReportDTO(report) : null;
    }

    @Override
    public List<TestReportDTO> getReportsByPatientId(Long patientId) {
        return testReportRepository.findByPatientId(patientId).stream()
                .map(TestReportDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TestReportDTO> getReportsByPatientId(Long patientId, Pageable pageable) {
        Page<TestReport> reports = testReportRepository.findByPatientId(patientId, pageable);
        List<TestReportDTO> reportDTOs = reports.getContent().stream()
                .map(TestReportDTO::new)
                .collect(Collectors.toList());
        return new PageImpl<>(reportDTOs, pageable, reports.getTotalElements());
    }

    @Override
    public Status saveOrUpdateReport(TestReportDTO testReportDTO) {
        try {
            TestReport testReport;
            
            if (testReportDTO.getId() != null && testReportDTO.getId() > 0) {
                // Update existing report
                Optional<TestReport> existingReport = testReportRepository.findById(testReportDTO.getId());
                if (existingReport.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test report not found")
                            .build();
                }
                testReport = existingReport.get();
            } else {
                // Create new report
                testReport = new TestReport();
                testReport.setReportNumber(generateReportNumber());
                testReport.setReportDate(LocalDateTime.now());
            }

            // Set patient
            if (testReportDTO.getPatient() != null && testReportDTO.getPatient().getId() != null) {
                Optional<Patient> patient = patientRepository.findById(testReportDTO.getPatient().getId());
                if (patient.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Patient not found")
                            .build();
                }
                testReport.setPatient(patient.get());
            }

            // Set test type
            if (testReportDTO.getTestType() != null && testReportDTO.getTestType().getId() != null) {
                Optional<TestType> testType = testTypeRepository.findById(testReportDTO.getTestType().getId());
                if (testType.isEmpty()) {
                    return Status.builder()
                            .status(false)
                            .message("Test type not found")
                            .build();
                }
                testReport.setTestType(testType.get());
            }

            testReport.setDiagnosis(testReportDTO.getDiagnosis());
            testReport.setComments(testReportDTO.getComments());
            testReport.setStatus(testReportDTO.getStatus());

            TestReport savedReport = testReportRepository.save(testReport);

            // Handle test results
            if (testReportDTO.getResults() != null && !testReportDTO.getResults().isEmpty()) {
                // Delete existing results if updating
                if (testReportDTO.getId() != null) {
                    testResultRepository.deleteByTestReportId(savedReport.getId());
                }

                // Save new results
                for (TestResultDTO resultDTO : testReportDTO.getResults()) {
                    TestResult testResult = new TestResult();
                    testResult.setTestReport(savedReport);
                    
                    if (resultDTO.getTestParameter() != null && resultDTO.getTestParameter().getId() != null) {
                        testResult.setTestParameter(testParameterRepository.findById(resultDTO.getTestParameter().getId()).orElse(null));
                    }
                    
                    testResult.setResultValue(resultDTO.getResultValue());
                    testResult.setResultText(resultDTO.getResultText());
                    testResult.setUnitOverride(resultDTO.getUnitOverride());
                    testResult.setNotes(resultDTO.getNotes());
                    testResult.setFlag(resultDTO.getFlag());
                    
                    testResultRepository.save(testResult);
                }
            }

            return Status.builder()
                    .status(true)
                    .message("Test report saved successfully")
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error saving test report: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public Status deleteReportById(Long id) {
        try {
            if (!testReportRepository.existsById(id)) {
                return Status.builder()
                        .status(false)
                        .message("Test report not found")
                        .build();
            }

            testReportRepository.deleteById(id);
            
            return Status.builder()
                    .status(true)
                    .message("Test report deleted successfully")
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error deleting test report: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public String generateReportNumber() {
        Integer maxSequence = testReportRepository.findMaxReportSequence();
        int nextSequence = (maxSequence != null ? maxSequence : 0) + 1;
        return String.format("LAB%06d", nextSequence);
    }

    @Override
    public byte[] downloadReportPdf(Long id) {
        log.info("Generating lab report PDF for ID: {}", id);

        try { 
            TestReportDTO reportDTO = getReportByIdWithResults(id);
            if (reportDTO == null) {
                log.warn("Test report not found for ID: {}", id);
                throw new EntityNotFoundException("Test report not found with ID: " + id);
            }

            // Prepare Thymeleaf HTML
            Context context = new Context();
            
            // Main SaaS logo – if fixed, else leave empty
            context.setVariable("mainLogoUrl", "https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png");

	        // Tenant logo – fallback to empty if not available
	        String tenantLogoUrl = "https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png";
	        context.setVariable("clinicLogo", tenantLogoUrl);
	        
	        context.setVariable("clinicForm", "Lab Report");
	        context.setVariable("clinicName", "Panda Patholab");
	        context.setVariable("clinicLocation", "Near Pati Medicine store, Dungura, Balasore, Odisha");
	        context.setVariable("clinicLogo", tenantLogoUrl);
	        
	        context.setVariable("patient", reportDTO.getPatient());
	        
            context.setVariable("report", reportDTO);
            context.setVariable("generatedDate", LocalDateTime.now());
            
            // QR Codes
            context.setVariable("reportQrImage", generateLabtestQRCode(reportDTO));
            context.setVariable("patientQrImage", patientService.generatePatientQRCode(reportDTO.getPatient()));
            context.setVariable("androidQrImage", qrCodeGenerator.generateQRCodeImage("https://play.google.com/store/games?hl=en_IN"));
            context.setVariable("iosQrImage", qrCodeGenerator.generateQRCodeImage("https://www.apple.com/in/app-store/"));
	        
            String htmlContent = templateEngine.process("reports/laboratory-report", context);

            // Set up font provider
            FontProvider fontProvider = new FontProvider();
            try {
                ClassPathResource fontResource = new ClassPathResource("fonts/OpenSans/OpenSans-Regular.ttf");
                FontProgram fontProgram = FontProgramFactory.createFont(fontResource.getInputStream().readAllBytes());
                fontProvider.addFont(fontProgram);
                log.info("Custom font loaded successfully from classpath.");
                
             // Bold font
                ClassPathResource fontResourceBold = new ClassPathResource("fonts/OpenSans/OpenSans-Bold.ttf");
                FontProgram fontProgramBold = FontProgramFactory.createFont(fontResourceBold.getInputStream().readAllBytes());
                fontProvider.addFont(fontProgramBold);
                log.info("Bold font loaded successfully.");
                
            } catch (Exception ex) {
                log.warn("Custom font load failed. Using system fonts. Reason: {}", ex.getMessage());
                fontProvider.addStandardPdfFonts();
                fontProvider.addSystemFonts();
            }
            
            

            // Converter settings
            ConverterProperties properties = new ConverterProperties();
            properties.setCharset("UTF-8");
            properties.setFontProvider(fontProvider);

            // Generate PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            pdfDoc.setDefaultPageSize(PageSize.A4); // Optional, if CSS handles it
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(0, 0, 0, 0);  // <-- KEY PART: no margins
            
            HtmlConverter.convertToPdf(htmlContent, outputStream, properties);

            log.info("PDF generated successfully for report ID: {}", id);
            return outputStream.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF for report ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error generating lab report PDF: " + e.getMessage(), e);
        }
    }
    
    
    private Object generateLabtestQRCode(TestReportDTO reportDTO) {
    	try {
            Map<String, Object> data = new HashMap<>();
            data.put("type", "test_report");
            data.put("reportId", reportDTO.getId());
            data.put("reportNumber", reportDTO.getReportNumber());
            data.put("reportDate", reportDTO.getReportDate().toString());

            String encoded = Base64Converter.encodeToBase64Json(data);
            log.info("Encoded Report QR: {}", encoded);
            return qrCodeGenerator.generateQRCodeImage(encoded); // returns base64 PNG

        } catch (Exception e) {
            log.error("Error generating test report QR code: {}", e.getMessage(), e);
            return null;
        }
	}

	@Override
    public Status sendReportByEmail(Long reportId, String toEmail, String subject) {
        try {
            TestReportDTO reportDTO = getReportByIdWithResults(reportId);
            if (reportDTO == null) {
                return Status.builder()
                        .status(false)
                        .message("Test report not found")
                        .build();
            }

            byte[] pdfData = downloadReportPdf(reportId);
            
            String emailContent = String.format(
                "<html><body>" +
                "<h2>Laboratory Test Report</h2>" +
                "<p>Dear Patient,</p>" +
                "<p>Please find attached your laboratory test report (Report No: %s).</p>" +
                "<p>Report Date: %s</p>" +
                "<p>If you have any questions, please contact our clinic.</p>" +
                "<br>" +
                "<p>Best regards,<br>ClinicHub Medical Center</p>" +
                "</body></html>",
                reportDTO.getReportNumber(),
                reportDTO.getReportDate()
            );

            MailRequest mailRequest = new MailRequest(
                this,
                "noreply@clinichub.com",
                toEmail,
                subject != null && !subject.isEmpty() ? subject : "Laboratory Test Report - " + reportDTO.getReportNumber(),
                emailContent,
                pdfData,
                "Laboratory_Report_" + reportDTO.getReportNumber() + ".pdf",
                "application/pdf"
            );

            eventPublisher.publishEvent(mailRequest);

            return Status.builder()
                    .status(true)
                    .message("Report sent successfully to " + toEmail)
                    .build();

        } catch (Exception e) {
            return Status.builder()
                    .status(false)
                    .message("Error sending report: " + e.getMessage())
                    .build();
        }
    }
}
