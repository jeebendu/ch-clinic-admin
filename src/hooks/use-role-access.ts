
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';

type RoleType = 'Admin' | 'Doctor' | 'Staff';

/**
 * Hook to handle role-based access control
 * @param allowedRoles - Roles that are allowed to access the current page
 * @param redirectPath - Path to redirect to if user doesn't have access
 */
export const useRoleAccess = (
  allowedRoles: RoleType | RoleType[],
  redirectPath: string = '/admin/dashboard'
) => {
  const navigate = useNavigate();
  const userRole = AuthService.getUserRole() as RoleType;
  
  const checkAccess = (): boolean => {
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(userRole);
    }
    return allowedRoles === userRole;
  };

  useEffect(() => {
    // If not logged in, redirect to login
    if (!AuthService.isLoggedIn()) {
      navigate('/');
      return;
    }

    // If user doesn't have access, redirect
    if (!checkAccess()) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'Admin':
          navigate('/admin/dashboard/admin');
          break;
        case 'Doctor':
          navigate('/admin/dashboard/doctor');
          break;
        case 'Staff':
          navigate('/admin/dashboard/staff');
          break;
        default:
          navigate(redirectPath);
      }
    }
  }, [userRole, allowedRoles, navigate, redirectPath]);

  return { userRole, hasAccess: checkAccess() };
};
