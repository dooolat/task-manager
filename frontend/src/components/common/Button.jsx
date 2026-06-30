export const Button = ({
  as: Component = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => {
  const isNativeButton = Component === 'button';

  return (
    <Component
      {...props}
      {...(isNativeButton ? { type } : {})}
      className={`button button--${variant} button--${size} ${className}`.trim()}
    >
      {children}
    </Component>
  );
};

