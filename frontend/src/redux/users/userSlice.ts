import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { signinThunk, signupThunk } from './userThunk';

export interface UserState {
  id?: string;
  name: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: undefined,
  name: '',
  loading: false,
  error: null,
};


// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser(state, action: PayloadAction<UserState>) {
//       state.id = action.payload.id;
//       state.name = action.payload.name;
//     },
//     clearUser(state) {
//       state.id = undefined;
//       state.name = '';
//     },
//   },
// });

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; name: string }>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    clearUser(state) {
      localStorage.clear();
      state.id = undefined;
      state.name = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action: PayloadAction<{ id: string; name: string }>) => {
        state.loading = false;
        state.id = action.payload.id;
        state.name = action.payload.name;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinThunk.fulfilled, (state, action: PayloadAction<{ token: string, user: { id: string; name: string }}>) => {
        state.loading = false;
        state.id = action.payload.user?.id;
        state.name = action.payload.user?.name;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;