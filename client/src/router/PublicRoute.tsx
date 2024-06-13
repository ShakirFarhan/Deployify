import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
const PublicRoute = () => {
  const { userToken } = useAppSelector((store) => store.auth);

  const location = useLocation();
  return userToken ? <Navigate to="/" state={location} replace /> : <Outlet />;
};

export default PublicRoute;
