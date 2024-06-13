import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../../../utils/types/global';
import { UserPayload } from '../../../utils/types/global';
const token = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null;
const initialState: AuthState = {
  userInfo: null,
  userToken: token,
  error: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUserCrendentials: (
      state,
      {
        payload,
      }: {
        payload: {
          user: Pick<UserPayload, 'email' | 'id' | 'role'>;
          token: string;
        };
      }
    ) => {
      payload.token && localStorage.setItem('userToken', payload.token);
      state.userInfo = payload.user;
      state.userToken = payload.token;
    },
  },
});
export const { setUserCrendentials } = authSlice.actions;
export default authSlice.reducer;
