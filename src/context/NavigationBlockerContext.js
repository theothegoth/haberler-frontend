import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationBlockerContext = createContext();

export const useNavigationBlocker = () => {
  const context = useContext(NavigationBlockerContext);
  if (!context) {
    throw new Error('useNavigationBlocker must be used within NavigationBlockerProvider');
  }
  return context;
};

export const NavigationBlockerProvider = ({ children }) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockerMessage, setBlockerMessage] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();

  // Reset pending navigation when location changes
  useEffect(() => {
    setPendingNavigation(null);
    setShowDialog(false);
  }, [location]);

  const enableBlocker = useCallback((message = 'You have unsaved changes. Are you sure you want to leave?') => {
    setIsBlocking(true);
    setBlockerMessage(message);
  }, []);

  const disableBlocker = useCallback(() => {
    setIsBlocking(false);
    setBlockerMessage('');
  }, []);

  const attemptNavigation = useCallback((navigateFunction) => {
    if (isBlocking) {
      setPendingNavigation(() => navigateFunction);
      setShowDialog(true);
      return false; // Navigation blocked
    }
    navigateFunction();
    return true; // Navigation allowed
  }, [isBlocking]);

  const confirmNavigation = useCallback(() => {
    setIsBlocking(false);
    setShowDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    setShowDialog(false);
    setPendingNavigation(null);
  }, []);

  const value = {
    isBlocking,
    blockerMessage,
    showDialog,
    enableBlocker,
    disableBlocker,
    attemptNavigation,
    confirmNavigation,
    cancelNavigation
  };

  return (
    <NavigationBlockerContext.Provider value={value}>
      {children}
    </NavigationBlockerContext.Provider>
  );
};
