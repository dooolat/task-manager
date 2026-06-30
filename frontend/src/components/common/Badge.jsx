export const Badge = ({ children, variant = 'default', tone = 'neutral', className = '', style = {} }) => (
  <span className={`badge badge--${variant} badge--${tone} ${className}`.trim()} style={style}>
    {children}
  </span>
);

