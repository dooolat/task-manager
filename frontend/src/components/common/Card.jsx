export const Card = ({ children, className = '', ...props }) => (
  <section className={`card ${className}`.trim()} {...props}>
    {children}
  </section>
);

