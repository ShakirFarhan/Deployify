import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
// import useValidUser from '../features/auth/hooks/useValidUser';
const PrivateRoute = () => {
  const { userToken } = useAppSelector((store) => store.auth);
  const location = useLocation();
  return userToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={location} replace />
  );
};

export default PrivateRoute;
