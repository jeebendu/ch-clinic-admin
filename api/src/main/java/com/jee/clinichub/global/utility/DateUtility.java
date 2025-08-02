package com.jee.clinichub.global.utility;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;
import com.jee.clinichub.global.context.TimeZoneContextHolder;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class DateUtility {

    private static final String DEFAULT_DATE_FORMAT = "dd-MMM-yyyy";
    private static final String DEFAULT_DATE_TIME_FORMATTER = "dd-MMM-yyyy hh:mm:ss a";
    private static final String OUTPUT_DATE_TIME_FORMATTER = "dd-MMM-yyyy hh:mm:ss a";

    public static Date stringToDate(String strDate) {
        return stringToDate(strDate, DEFAULT_DATE_FORMAT);
    }

    public static Date stringToDate(String strDate, String format) {
        Date date = null;
        try {
            DateFormat formatter = new SimpleDateFormat(format);
            date = formatter.parse(strDate);
        } catch (Exception e) {
            log.error("Error parsing date: " + strDate, e);
        }
        return date;
    }

    public static String dateToString(Date date) {
        String orderDateString = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat(OUTPUT_DATE_TIME_FORMATTER);
		 	orderDateString = formatter.format(date);
        } catch (Exception e) {
            log.error("Error formatting date: " + date, e);
        }
        return orderDateString;
    }

    public static Date addMonth(int month) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, month);
        return cal.getTime();
    }

    public static int getMonth(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal.get(Calendar.MONTH);
    }

    public static int getYear(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal.get(Calendar.YEAR);
    }

    public static <T extends Date> T setEndOfDay(T date) {
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            calendar.set(Calendar.MILLISECOND, 999);
            date.setTime(calendar.getTimeInMillis());
        }
        return date;
    }

    public static <T extends Date> boolean isActive(T effectiveFrom, T effectiveTo, T today) {
        return (effectiveFrom != null && (today.compareTo(effectiveFrom) >= 0) &&
                (effectiveTo == null || today.compareTo(effectiveTo) <= 0));
    }

    public static String convertToTargetTimeZone(String dateTimeString) {
        // Get the target time zone
        ZoneId zoneId = TimeZoneContextHolder.getTimeZone();

        log.info("Received date " + dateTimeString + " for zone " + zoneId.getId());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMATTER);

        // Parse the input date string to LocalDateTime in UTC
        LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);
        ZonedDateTime utcZonedDateTime = localDateTime.atZone(ZoneId.of("UTC"));

        // Convert ZonedDateTime from UTC to the target time zone
        ZonedDateTime targetZonedDateTime = utcZonedDateTime.withZoneSameInstant(zoneId);

        // Format the ZonedDateTime to a string in the target time zone
		String formattedDateTime = targetZonedDateTime.format(formatter);

        log.info("Converted local date " + formattedDateTime);

        return formattedDateTime;
    }
}