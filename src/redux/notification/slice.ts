import { createSlice } from '@reduxjs/toolkit';

interface INotificationSliceState {
  notificationCount: number;
}

const initialState: INotificationSliceState = {
  notificationCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationCount: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.notificationCount = action.payload;
    }
  }
});

export default notificationSlice;
