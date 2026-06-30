import logoMark from '../../assets/task-manager-logo-mark.png';

export const AppLogo = ({ className = '' }) => (
  <img className={`sidebar__logo ${className}`.trim()} src={logoMark} alt="Task Manager logo" />
);
