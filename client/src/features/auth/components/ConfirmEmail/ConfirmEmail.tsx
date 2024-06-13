import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch } from '../../../../store';
import { useVerifyEmailMutation } from '../../hooks';
import { setUserCrendentials } from '../../slices/authSlice';

const ConfirmEmail = () => {
  const [VerifyCode, { data, isSuccess, isError, isLoading, error }] =
    useVerifyEmailMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    console.log(code);
    if (code) {
      VerifyCode(code);
    }
  }, [location.search]);

  useEffect(() => {
    if (isSuccess) {
      if (data.token) {
        dispatch(setUserCrendentials({ user: data.user, token: data.token }));
        navigate('/register/verified');
      }
    }
  }, [isSuccess, isError]);

  return (
    <div>
      {isLoading
        ? 'Please wait ...'
        : isError
        ? 'Something went wrong.'
        : 'Verifying...'}
    </div>
  );
};

export default ConfirmEmail;
