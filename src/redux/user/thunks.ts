import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../services/api';

const fetchUserAsync = createAsyncThunk<Instalike.User>(
  'user/fetchUser',
  async () => {
    const response = await api.get<Instalike.User>('/users/me');

    return response.data;
  }
);

export default fetchUserAsync;
