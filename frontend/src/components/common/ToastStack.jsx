import { Button } from './Button.jsx';

const getToastLabel = (variant) => {
  if (variant === 'error') return 'Error';
  if (variant === 'info') return 'Info';
  return 'Success';
};

export const ToastStack = ({ notifications, onDismiss }) => (
  <div className="toast-stack" aria-live="polite" aria-atomic="true">
    {notifications.map((notification) => (
      <div key={notification.id} className={`toast toast--${notification.variant}`}>
        <div>
          <strong>{getToastLabel(notification.variant)}</strong>
          <p>{notification.message}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDismiss(notification.id)} aria-label="Dismiss notification">
          ×
        </Button>
      </div>
    ))}
  </div>
);

