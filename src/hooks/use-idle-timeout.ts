
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_TIME = 60 * 1000; // 1 minute in milliseconds

export const useIdleTimeout = () => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const handleIdle = useCallback(() => {
    AuthService.logout();
    navigate('/login');
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity",
    });
  }, [navigate, toast]);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    const checkIdle = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= IDLE_TIMEOUT) {
        handleIdle();
      } else if (timeSinceLastActivity >= IDLE_TIMEOUT - WARNING_TIME && !showWarning) {
        setShowWarning(true);
        toast({
          title: "Session Warning",
          description: "Your session will expire in 1 minute due to inactivity",
          duration: 60000, // Show for the full minute
        });
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(checkIdle);
    };
  }, [lastActivity, handleActivity, handleIdle, showWarning, toast]);
};
