import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    buttonText: 'OK'
  });

  const showAlert = useCallback((options) => {
    const {
      title = 'Alert',
      message,
      type = 'info',
      buttonText = 'OK'
    } = options;

    setAlert({
      isOpen: true,
      title,
      message,
      type,
      buttonText
    });
  }, []);

  const showSuccess = useCallback((message, title = 'Success!') => {
    showAlert({ title, message, type: 'success' });
  }, [showAlert]);

  const showError = useCallback((message, title = 'Error') => {
    showAlert({ title, message, type: 'error' });
  }, [showAlert]);

  const showWarning = useCallback((message, title = 'Warning') => {
    showAlert({ title, message, type: 'warning' });
  }, [showAlert]);

  const showInfo = useCallback((message, title = 'Information') => {
    showAlert({ title, message, type: 'info' });
  }, [showAlert]);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert
  };
};