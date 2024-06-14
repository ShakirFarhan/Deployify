import { useEffect } from 'react';
import { setUserCrendentials } from '../../slices/authSlice';
import { PageLoader } from '../../../../components/PageLoader/PageLoader';
import { useAppDispatch } from '../../../../store';
import { useGithubAuthMutation } from '../../hooks';

const GithubCallBack = () => {
  const code = new URLSearchParams(window.location.search).get('code');
  const dispatch = useAppDispatch();
  const [GithubLogin, { isSuccess, isLoading, data, isError }] =
    useGithubAuthMutation();
  useEffect(() => {
    if (code) {
      GithubLogin(code);
    }
  }, [code, GithubLogin]);

  useEffect(() => {
    if (isSuccess) {
      if (data.token) {
        dispatch(setUserCrendentials(data));
      }
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) {
    return <PageLoader />;
  }
  if (isError) {
    return <p>Something went wrong.</p>;
  } else {
    return <></>;
  }
};

export default GithubCallBack;
