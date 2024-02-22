import { createSlice } from '@reduxjs/toolkit';

import fetchUserAsync from './thunks';

interface IUserSliceState {
  loggedUser: Instalike.User | Record<string, never>;
  isLoggedIn: boolean;
}

const initialState: IUserSliceState = {
  loggedUser: {},
  isLoggedIn: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.loggedUser = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.isLoggedIn = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserAsync.fulfilled, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.loggedUser = action.payload;
    });
  }
});

export default userSlice;
