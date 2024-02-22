import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user;

export const selectLoggedUser = (state: RootState) => selectUser(state).loggedUser;
