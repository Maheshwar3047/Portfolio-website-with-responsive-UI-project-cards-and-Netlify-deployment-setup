import React, { createContext, useContext, ReactNode } from 'react';
import { DatabaseNotification } from '../components/common/DatabaseNotification';
import { useState } from 'react';

interface DatabaseContextType {
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function useDatabaseContext() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <DatabaseContext.Provider value={{ showNotification }}>
      {children}
      <DatabaseNotification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleClose}
      />
    </DatabaseContext.Provider>
  );
}