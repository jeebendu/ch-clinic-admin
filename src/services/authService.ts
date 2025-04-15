
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
      }
      
      return response.data as User;
    } catch (error) {
      console.error("Login error:", error);
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
   * Check if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('user');
  }
};

export default AuthService;
