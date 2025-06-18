import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chats/chatReducer';
import roomReducer from './rooms/roomReducer';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;