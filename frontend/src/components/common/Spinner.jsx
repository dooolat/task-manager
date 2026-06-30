export const Spinner = ({ label = 'Loading' }) => (
  <div className="spinner-wrap" role="status" aria-live="polite" aria-label={label}>
    <span className="spinner" />
  </div>
);

