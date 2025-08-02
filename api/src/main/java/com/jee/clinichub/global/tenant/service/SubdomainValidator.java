package com.jee.clinichub.global.tenant.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;

@Component
public class SubdomainValidator {

    // Complete reserved keywords list from earlier discussion
    private static final String[] RESERVED_KEYWORDS = {
        // General/System/Infrastructure
        "www", "api", "admin", "app", "auth", "login", "signup", "register", "logout",
        "static", "assets", "cdn", "mail", "smtp", "email", "imap", "pop", "ftp",
        "support", "help", "docs", "documentation", "blog", "news", "status", "portal",
        "console", "dashboard", "public", "private", "test", "dev", "stage", "staging",
        "preview", "beta", "demo", "secure", "config", "system", "internal", "data",
        "files", "images", "media", "upload", "download", "webmail", "web", "home",
        "root", "search", "feedback", "monitor", "monitoring", "update", "cron", "jobs",
        "services", "service", "backend", "front", "frontend", "node", "db", "database",
        "gateway", "proxy", "metrics", "logs", "trace", "master",

        // DevOps & API-related
        "actuator", "swagger", "graphql", "api-docs", "openapi", "rest", "rpc",
        "firewall", "vault", "secrets", "adminer", "configserver", "dns", "tls", "ssl", "cert",
        "health", "ping", "uptime", "scanner", "explorer",
        "k8s", "kubernetes", "helm", "terraform", "ansible", "jenkins", "gitlab",
        "ci", "ci-cd", "build", "deploy", "pipeline", "container", "registry",

        // Legal/Marketing
        "terms", "privacy", "legal", "about", "contact", "pricing", "billing", "payment",
        "invoice", "subscribe", "unsubscribe", "tracking", "analytics",
        "error", "404", "maintenance", "testdomain", "example", "sample", "sandbox",

        // Clinic-specific reserved words
        "adminpanel", "analytics", "appointment", "appointments", "assistant",
        "availability", "billing", "book", "booking", "bookings", "branch", "branches",
        "calendar", "call", "calls", "cancel", "chat", "checkin", "checkout", "checkup",
        "claim", "claims", "clinic", "clinics", "config", "configuration", "consultation",
        "consultations", "contact", "copay", "dashboard", "department", "departments",
        "diagnosis", "diagnostics", "doctor", "doctors", "drug", "drugs", "ehr", "emr",
        "examination", "faq", "fee", "fees", "health", "help", "history", "hospital", "hospitals",
        "imaging", "insurance", "intake", "invoice", "invoices", "lab", "labs", "location",
        "locations", "medicalhistory", "message", "messages", "mri", "notes", "notify",
        "nurse", "nurses", "onboarding", "patient", "patients", "payment", "payments",
        "portal", "prescription", "prescriptions", "pricing", "profile", "profiles",
        "queue", "radiology", "record", "records", "referral", "referrals", "reminder",
        "reminders", "report", "reports", "reschedule", "room", "rooms", "rx", "scan",
        "scans", "schedule", "scheduler", "settings", "setup", "slot", "slots", "specialist",
        "staff", "stat", "stats", "summary", "support", "team", "telehealth", "test",
        "tests", "therapies", "therapy", "timings", "transaction", "transactions",
        "treatment", "treatments", "ultrasound", "video", "vital", "vitals", "visit",
        "visits", "voice", "wallet", "xray"
    };

    // Regex pattern to detect any reserved word inside subdomain ignoring dashes/underscores
    private static final Pattern RESERVED_PATTERN;

    static {
        String patternString = ".*(" + String.join("|", RESERVED_KEYWORDS) + ").*";
        RESERVED_PATTERN = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
    }

    /**
     * Checks if the subdomain is invalid by matching any reserved keyword.
     * Ignores dashes and underscores in the input for more flexible matching.
     * 
     * @param subdomain the subdomain to check
     * @return true if invalid/reserved, false if allowed
     */
    public static boolean isInvalidSubdomain(String subdomain) {
        if (subdomain == null || subdomain.trim().isEmpty()) {
            return true; // empty or null is invalid
        }
        // Normalize: lower case + remove dashes and underscores
        String normalized = subdomain.toLowerCase().replace("-", "").replace("_", "");

        Matcher matcher = RESERVED_PATTERN.matcher(normalized);
        return matcher.matches();
    }

    
}

