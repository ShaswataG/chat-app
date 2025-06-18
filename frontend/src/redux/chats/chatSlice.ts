import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Message {
  roomId: string;
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
      const { roomId } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(action.payload);
    },
    setMessages(state, action: PayloadAction<{ roomId: string; messages: Message[] }>) {
      state.messages[action.payload.roomId] = action.payload.messages;
    },
  },
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;