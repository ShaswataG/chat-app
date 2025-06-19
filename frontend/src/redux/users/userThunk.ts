import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance'; // Adjust the import path as necessary

export const signupThunk = createAsyncThunk(
    'user/signup',
    async (payload: { name: string; password: string }, thunkAPI) => {
        try {
            const res = await axios.post('/auth/signup', payload);
            return res.data.data; // assuming response includes { id, name }
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Signup failed');
        }
    }
);

export const signinThunk = createAsyncThunk(
    'user/signin',
    async (payload: { name: string; password: string }, thunkAPI) => {
        try {
            const res = await axios.post('/auth/signin', payload);
            return  {
                token: res.data.data.token,
                user: res.data.data.user
            };
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);