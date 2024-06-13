import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserPayload } from '../../../utils/types/global';
export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['User'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api-user/v1/auth',
  }),
  // graphqlRequestBaseQuery({
  //   client,
  //   prepareHeaders: (headers, { getState }) => {
  //     const token = (getState() as RootState).auth.userToken;
  //     if (token) {
  //       headers.set('Authorization', `Bearer ${token}`);
  //     }
  //     return headers;
  //   },
  // })
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { user: UserPayload; token: string },
      Pick<UserPayload, 'email' | 'password'>
    >({
      query: (user) => ({
        url: '/login',
        method: 'POST',
        body: user,
      }),
    }),
    register: builder.mutation<
      { message: string },
      Pick<UserPayload, 'email' | 'fullName' | 'password'>
    >({
      query: (user) => ({
        url: '/register',
        method: 'POST',
        body: user,
      }),
    }),
    userByEmail: builder.query<{ message: boolean }, string>({
      query: (email) => ({
        method: 'GET',
        url: `/user?email=${email}`,
      }),
    }),
    verifyEmail: builder.mutation<
      { token: string; user: Pick<UserPayload, 'email' | 'id' | 'role'> },
      string
    >({
      query: (token) => ({
        method: 'PATCH',
        url: `/verify?token=${token}`,
      }),
    }),
  }),
});
export const {
  useLoginUserMutation,
  useRegisterMutation,
  useUserByEmailQuery,
  useVerifyEmailMutation,
} = authApi;
