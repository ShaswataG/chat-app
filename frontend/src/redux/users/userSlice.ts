import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id?: string;
  name: string;
}

const initialState: UserState = {
  id: undefined,
  name: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    clearUser(state) {
      state.id = undefined;
      state.name = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;