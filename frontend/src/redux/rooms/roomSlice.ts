import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
  joinedRooms: string[];
}

const initialState: RoomState = {
  joinedRooms: [],
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    joinRoom(state, action: PayloadAction<string>) {
      if (!state.joinedRooms.includes(action.payload)) {
        state.joinedRooms.push(action.payload);
      }
    },
    leaveRoom(state, action: PayloadAction<string>) {
      state.joinedRooms = state.joinedRooms.filter(room => room !== action.payload);
    },
  },
});

export const { joinRoom, leaveRoom } = roomSlice.actions;
export default roomSlice.reducer;