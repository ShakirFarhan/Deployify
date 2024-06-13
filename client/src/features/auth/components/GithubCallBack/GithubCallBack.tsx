import { useEffect } from 'react';
// import { useGithubOAuthMutation } from '../../hooks';

import { setUserCrendentials } from '../../slices/authSlice';
import { PageLoader } from '../../../../components/PageLoader/PageLoader';
import { useAppDispatch } from '../../../../store';

const GithubCallBack = () => {
  const code = new URLSearchParams(window.location.search).get('code');
  const dispatch = useAppDispatch();
  // const [GithubLogin, { isSuccess, isLoading, data, isError }] =
  //   useGithubOAuthMutation();
  // useEffect(() => {
  //   if (code) {
  //     GithubLogin({ code });
  //   }
  // }, [code, GithubLogin]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     if (data?.githubOAuth) {
  //       dispatch(setUserCrendentials(data.githubOAuth));
  //     }
  //   }
  // }, [isSuccess, data?.githubOAuth, dispatch]);

  // if (isLoading) {
  //   return <PageLoader />;
  // }
  // if (isError) {
  //   return <p>Something went wrong.</p>;
  // } else {
  return <>Hello</>;
  // }
};

export default GithubCallBack;
