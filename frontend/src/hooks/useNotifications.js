import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext.jsx';

export const useNotifications = () => useContext(NotificationContext);

