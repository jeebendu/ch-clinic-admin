package com.jee.clinichub.app.branch.context;

import com.jee.clinichub.app.branch.model.Branch;

/**
 * @author Md. Amran Hossain
 * The context holder implementation is a container that stores the current context as a ThreadLocal reference.
 */
public class BranchContextHolder {

    private static final ThreadLocal<Branch> contextHolder = new ThreadLocal<>();
    
    public static ThreadLocal<Branch> getBranch() {
        return contextHolder;
    }

    public static void setCurrentBranch(Branch branch) {
        contextHolder.set(branch);
    }

    public static Branch getCurrentBranch() {
        return contextHolder.get();
    }

    public static void clear() {
        contextHolder.remove();
    }
}
