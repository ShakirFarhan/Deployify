import { useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { useLoginUserMutation } from '../../../features/auth/hooks';
import { LoginCredentials } from '../../../utils/types/ui/pages.types';
import { setUserCrendentials } from '../../../features/auth/slices/authSlice';
import LoginForm from '../../../features/auth/components/Login/Form/Form';

const Login = () => {
  const [setLoginUser, { isLoading, isSuccess, data, error }] =
    useLoginUserMutation();
  const dispatch = useAppDispatch();
  const handleSubmit = (loginDetails: LoginCredentials) => {
    setLoginUser(loginDetails);
  };
  useEffect(() => {
    async function handleLogin() {
      if (isSuccess) {
        console.log(data);
        if (data) {
          dispatch(setUserCrendentials(data));
          // toast.success(`Welcome ${data.loginUser?.user.username}`);
        } else {
          // toast.error('Something Went Wrong...');
          console.log('something went wrong ');
        }
      }
    }
    handleLogin();
  }, [isSuccess, data, dispatch]);
  console.log(error);
  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Login;
