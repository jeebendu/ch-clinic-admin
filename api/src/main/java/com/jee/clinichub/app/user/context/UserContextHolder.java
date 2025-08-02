package com.jee.clinichub.app.user.context;

import com.jee.clinichub.app.user.model.User;

/**
 * @author Md. Amran Hossain
 * The context holder implementation is a container that stores the current context as a ThreadLocal reference.
 */
public class UserContextHolder {

    private static final ThreadLocal<User> contextHolder = new ThreadLocal<>();
    
    public static ThreadLocal<User> getUser() {
        return contextHolder;
    }

    public static void setCurrentUser(User user) {
        contextHolder.set(user);
    }

    public static User getCurrentUser() {
        return contextHolder.get();
    }

    public static void clear() {
        contextHolder.remove();
    }
}
