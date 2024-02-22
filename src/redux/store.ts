import { configureStore } from '@reduxjs/toolkit';

import userSlice from './user/slice';
import notificationSlice from './notification/slice';

export const { setLoggedUser, setIsLoggedIn } = userSlice.actions;

export const { setNotificationCount } = notificationSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notification: notificationSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
