import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllRooms, getRoomById } from './roomThunk';

export interface Room {
  id: string;
  name: string;
  // add more fields here if your schema grows
}

interface RoomState {
  joinedRooms: Room[];
  allRooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  joinedRooms: [],
  allRooms: [],
  currentRoom: null,
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    joinRoom(state, action: PayloadAction<Room>) {
      if (!state.joinedRooms.find(r => r.id === action.payload.id)) {
        state.joinedRooms.push(action.payload);
      }
    },
    leaveRoom(state, action: PayloadAction<string>) {
      state.joinedRooms = state.joinedRooms.filter(room => room.id !== action.payload);
    },
    setCurrentRoom(state, action: PayloadAction<Room>) {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRooms.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.allRooms = action.payload.map((room: any) => ({ 
          id: room._id,
          name: room.name,
         }));
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      })
      .addCase(getRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentRoom = {
          id: action.payload._id,
          name: action.payload.name,
        };
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch room';
      });
  }
});

export const { joinRoom, leaveRoom, setCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;