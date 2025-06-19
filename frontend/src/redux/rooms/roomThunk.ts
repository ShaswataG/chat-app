import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { type Room } from './roomSlice';

export const getAllRooms = createAsyncThunk<Room[]>('room/getAllRooms', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/room');
    return res.data.data.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load rooms');
  }
});

export const getRoomById = createAsyncThunk<Room, string>('room/getRoomById', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`/room/${id}`);
    return res.data.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load room');
  }
});