export const Select = ({ label, error, children, className = '', ...props }) => (
  <label className="field">
    {label ? <span className="field__label">{label}</span> : null}
    <select className={`input select ${error ? 'input--error' : ''} ${className}`.trim()} {...props}>
      {children}
    </select>
    {error ? <span className="field__error">{error}</span> : null}
  </label>
);

