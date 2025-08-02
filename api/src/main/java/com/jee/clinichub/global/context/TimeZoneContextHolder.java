package com.jee.clinichub.global.context;
import java.time.ZoneId;
public class TimeZoneContextHolder {

    private static final ThreadLocal<ZoneId> contextHolder = new ThreadLocal<>();

    public static void setTimeZone(ZoneId timeZone) {
        contextHolder.set(timeZone);
    }

    public static ZoneId getTimeZone() {
        return contextHolder.get();
    }

    public static void clear() {
        contextHolder.remove();
    }
}
