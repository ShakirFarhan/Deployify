import {
  Middleware,
  MiddlewareAPI,
  configureStore,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from './features/auth/hooks';
import { authSlice } from './features/auth/slices';
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.log(action);
      const payload = action.payload as {
        data: { error: string };
        status: number;
      };
      console.log(payload);
    }

    return next(action);
  };
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(rtkQueryErrorLogger),
});
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
