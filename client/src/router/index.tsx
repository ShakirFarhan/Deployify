import React, { useEffect, Suspense } from 'react';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { PageLoader } from '../components/PageLoader/PageLoader';
import GithubCallBack from '../features/auth/components/GithubCallBack/GithubCallBack';

import useValidUser from '../features/auth/hooks/useValidUser';

import { useAppDispatch, useAppSelector } from '../store';
import Main from '../layout/Main/Main';
import ConfirmEmail from '../features/auth/components/ConfirmEmail/ConfirmEmail';

// const Main = React.lazy(() => import('../layout/Main/Main'));
const Login = React.lazy(() => import('../pages/Auth/Login/Login'));
const Signup = React.lazy(() => import('../pages/Auth/Signup/Signup'));

// const ConfirmEmail = React.lazy(
//   () => import('../features/auth/components/ConfirmEmail/ConfirmEmail')
// );
const Dashboard = React.lazy(() => import('../pages/Dashboard/Dashboard'));
const ENDPOINT = import.meta.env.VITE_GITHUB_CLIENT_ID as string;

export default function AppRouter() {
  useValidUser();
  const { userInfo } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  return (
    <Suspense fallback={<PageLoader />}>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
            <Route path="oauth-callback" element={<GithubCallBack />} />
          </Route>
          <Route path="verify-email" element={<ConfirmEmail />} />
          <Route path="register/verified" element={<Signup />} />
          <Route path="/" element={<Main />}>
            <Route element={<PrivateRoute />}>
              {/* <Route element={<Outlet />}> */}
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
          {/* <Route element={<PrivateRoute />}>
            <Route path="/messages" element={<ChatLayout />}>
              <Route path="" element={<Welcome />} />
              <Route path=":username" element={<Chat />} />
            </Route>
          </Route> */}
        </Routes>
      </Router>
    </Suspense>
  );
}
