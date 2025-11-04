import { useNavigate } from 'react-router-dom';
import { useNavigationBlocker } from '../context/NavigationBlockerContext';

const BlockedLink = ({ to, children, className, ...props }) => {
  const navigate = useNavigate();
  const { attemptNavigation } = useNavigationBlocker();

  const handleClick = (e) => {
    e.preventDefault();
    attemptNavigation(() => navigate(to));
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default BlockedLink;
