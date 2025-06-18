
import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";

// For testing purposes
const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minute in milliseconds
const WARNING_TIME = 60 * 1000; // 60 seconds in milliseconds

export const useIdleTimeout = () => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userData = AuthService.getCurrentUser();

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const handleActivity = useCallback(() => {
    if (!showLockScreen) {
      resetActivity();
    }
  }, [resetActivity, showLockScreen]);

  const lockScreen = useCallback(() => {
    setShowLockScreen(true);
    setShowWarning(false);
  }, []);

  const handleReAuthenticate = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Get username from stored user data
      const username = userData?.username || '';
      
      if (!username) {
        throw new Error('User information not found. Please log in again.');
      }
      
      await AuthService.reAuthenticate(username, password);
      setShowLockScreen(false);
      setPassword('');
      resetActivity();
      toast({
        title: "Session Resumed",
        description: "Welcome back! Your session has been restored.",
      });
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullLogout = () => {
    AuthService.logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been logged out. Please sign in again.",
    });
  };

  // Set up timers for inactivity checking
  useEffect(() => {
    if (showLockScreen) return; // Don't check for inactivity if already locked

    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    
    // Set warning timer
    const timeUntilWarning = IDLE_TIMEOUT - WARNING_TIME;
    warningTimerRef.current = setTimeout(() => {
      if (!showLockScreen) {
        setShowWarning(true);
      }
    }, timeUntilWarning);
    
    // Set lock screen timer
    timerRef.current = setTimeout(() => {
      if (!showLockScreen) {
        lockScreen();
      }
    }, IDLE_TIMEOUT);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [lastActivity, showLockScreen, lockScreen]);

  // Add event listeners for user activity
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

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  // JSX for the idle warning dialog
  const IdleWarningDialog = (
    <AlertDialog open={showWarning}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in 30 seconds due to inactivity. Do you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <AlertDialogAction onClick={resetActivity}>
            Continue Session
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );

  // JSX for the lock screen dialog
  const LockScreenDialog = (
    <Dialog open={showLockScreen} onOpenChange={v => !v && handleFullLogout()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Locked</DialogTitle>
          <DialogDescription>
            Your session has been locked due to inactivity. Please enter your password to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleReAuthenticate();
                  }
                }}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleFullLogout}>
            Log Out
          </Button>
          <Button onClick={handleReAuthenticate} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Unlock'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    IdleWarningDialog,
    LockScreenDialog,
    isLocked: showLockScreen
  };
};
