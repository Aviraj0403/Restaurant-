import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return user ? (
    children
  ) : (
    <Navigate
      to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};

export default AuthRoute;
