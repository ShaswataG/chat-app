import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Message {
  room: string;
  username: string;
  message: string;
  timestamp: string;
}

interface ChatState {
  messages: Record<string, Message[]>; // room => messages
}

const initialState: ChatState = {
  messages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      const { room } = action.payload;
      if (!state.messages[room]) state.messages[room] = [];
      state.messages[room].push(action.payload);
    },
    setMessages(state, action: PayloadAction<{ room: string; messages: Message[] }>) {
      state.messages[action.payload.room] = action.payload.messages;
    },
  },
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;