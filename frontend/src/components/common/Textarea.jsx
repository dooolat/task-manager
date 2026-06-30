export const Textarea = ({ label, error, helperText, className = '', ...props }) => (
  <label className="field">
    {label ? <span className="field__label">{label}</span> : null}
    <textarea className={`input textarea ${error ? 'input--error' : ''} ${className}`.trim()} {...props} />
    {error ? <span className="field__error">{error}</span> : null}
    {!error && helperText ? <span className="field__help">{helperText}</span> : null}
  </label>
);

