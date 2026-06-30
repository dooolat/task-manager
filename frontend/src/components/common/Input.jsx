export const Input = ({ label, error, helperText, className = '', ...props }) => (
  <label className="field">
    {label ? <span className="field__label">{label}</span> : null}
    <input className={`input ${error ? 'input--error' : ''} ${className}`.trim()} {...props} />
    {error ? <span className="field__error">{error}</span> : null}
    {!error && helperText ? <span className="field__help">{helperText}</span> : null}
  </label>
);

