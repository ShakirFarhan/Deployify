import { useEffect, useState } from 'react';
// import { useIsvalidUserQuery } from './useAuth';

import { setUserCrendentials } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';

const useValidUser = () => {
  let token = localStorage.getItem('userToken') as string;
  token = token ? token : '';
  const [validUser, setValidUser] = useState(false);
  // const { isSuccess, data, error } = useIsvalidUserQuery({
  //   token,
  // });
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (token) {
  //     if (isSuccess) {
  //       if (data) {
  //         if (data.isValidUser?.id) {
  //           setValidUser(true);
  //           dispatch(setUserCrendentials({ user: data.isValidUser, token }));
  //         }
  //       }
  //     }
  //   }
  // }, [isSuccess, token, dispatch]);
  // useEffect(() => {
  //   if (error) {
  //     localStorage.removeItem('userToken');
  //   }
  // }, [error]);

  return validUser;
};

export default useValidUser;
