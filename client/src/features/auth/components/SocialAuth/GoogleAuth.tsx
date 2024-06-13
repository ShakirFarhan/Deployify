import { FcGoogle } from 'react-icons/fc';
import styles from './SocialAuth.module.css';
import {
  CodeResponse,
  CredentialResponse,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from '@react-oauth/google';
// import { useGoogleOAuthMutation } from '../../hooks';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store';
// import { useAppDispatch } from '../../../../store';
// import { setUserCrendentials } from '../../slices/authSlice';
const GoogleAuth = () => {
  // const [GoogleLogin, { isSuccess, data }] = useGoogleOAuthMutation();
  // const dispatch = useAppDispatch();
  // const handleOnSuccess = async (
  //   response: CodeResponse | CredentialResponse
  // ) => {
  //   console.log(response);

  //   if ('code' in response) {
  //     GoogleLogin({ tokenId: response.code, tokenType: 'code' });
  //   } else if ('credential' in response) {
  //     GoogleLogin({
  //       tokenId: response.credential as string,
  //       tokenType: 'credentail',
  //     });
  //   } else {
  //   }
  // };
  // const handleOnError = () => {
  //   console.log('Authentication failed');
  // };

  // const login = useGoogleLogin({
  //   onSuccess: handleOnSuccess,
  //   onError: handleOnError,
  //   flow: 'auth-code',
  // });
  // useGoogleOneTapLogin({
  //   onSuccess: handleOnSuccess,
  //   onError: handleOnError,
  // });
  // useEffect(() => {
  //   if (isSuccess) {
  //     if (data?.googleOAuth) {
  //       dispatch(setUserCrendentials(data.googleOAuth));
  //     }
  //   }
  // }, [isSuccess, data?.googleOAuth, dispatch]);
  return (
    <>
      {/* <button onClick={() => login()} className={styles.social__button}> */}
      <button className={styles.social__button}>
        <FcGoogle className={styles.social__icon} />
        <p>Continue with Google</p>
      </button>
    </>
  );
};

export default GoogleAuth;
