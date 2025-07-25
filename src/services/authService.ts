
import http from "@/lib/JwtInterceptor";
import { getTenantId } from "@/utils/tenantUtils";
import { EncryptionService } from "@/utils/encryptionService";
import { User } from "@/admin/modules/user/types/User";

/**
 * Service for handling authentication-related API calls
 */
const AuthService = {
  /**
   * Login with username and password
   */
  login: async (username: string, password: string) => {
    try {
      // Encrypt the password
      const encryptedPassword = EncryptionService.encrypt(password);
      
      // Get tenant from tenant utils
      const tenantId = getTenantId();
      
      // Set tenant header
      const headers = {
        tenant: tenantId
      };

      const response = await http.post('/api/v1/auth/signin', 
        {
          username,
          password: encryptedPassword
        },
        { headers }
      );
      
      if (response.data) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_role', response.data.role || 'Staff'); // Store role
      }
      
      return response.data as User;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Re-authenticate with existing username and new password
   */
  reAuthenticate: async (username: string, password: string) => {
    try {
      // This is similar to login but specifically for session re-authentication
      const encryptedPassword = EncryptionService.encrypt(password);
      const tenantId = getTenantId();
      
      const headers = {
        tenant: tenantId
      };

      const response = await http.post('/api/v1/auth/signin', 
        {
          username,
          password: encryptedPassword
        },
        { headers }
      );
      
      if (response.data) {
        // Update token only, preserve other user data
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data as User;
    } catch (error) {
      console.error("Re-authentication error:", error);
      throw error;
    }
  },

  /**
   * Forgot password request
   */
  forgotPassword: async (email: string) => {
    try {
      // Get tenant from tenant utils
      const tenantId = getTenantId();
      
      // Set tenant header
      const headers = {
        tenant: tenantId
      };

      const response = await http.post('/api/v1/auth/forgotPassword', 
        { email },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  },

  /**
   * Get the current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  },

  /**
   * Get the current user role
   */
  getUserRole: (): string => {
    return localStorage.getItem('user_role') || 'Staff';
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: string | string[]): boolean => {
    const userRole = AuthService.getUserRole();
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('user');
  }
};

export default AuthService;
