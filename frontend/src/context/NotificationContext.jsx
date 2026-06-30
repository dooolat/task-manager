import { createContext, useCallback, useMemo, useState } from 'react';
import { ToastStack } from '../components/common/ToastStack.jsx';

export const NotificationContext = createContext(null);

const createNotificationId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (message, variant = 'success') => {
      const id = createNotificationId();

      setNotifications((current) => [...current, { id, message, variant }]);

      window.setTimeout(() => {
        removeNotification(id);
      }, 3500);
    },
    [removeNotification]
  );

  const value = useMemo(
    () => ({
      notify,
      success: (message) => notify(message, 'success'),
      error: (message) => notify(message, 'error'),
      info: (message) => notify(message, 'info'),
      removeNotification
    }),
    [notify, removeNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      <ToastStack notifications={notifications} onDismiss={removeNotification} />
      {children}
    </NotificationContext.Provider>
  );
};

