import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAllRooms } from '../redux/rooms/roomThunk';
import UsernameInput from '../components/custom/global/UsernameInput';
import Sidebar from '../components/custom/global/Sidebar';
import { Outlet } from 'react-router-dom';
import { setUser } from '../redux/users/userSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.user);

  const handleUsernameSubmit = (name: string) => {
    dispatch(setUser({ name }));
  }

  useEffect(() => {8
    dispatch(getAllRooms()).unwrap();
    
  }, []);

  if (!name) return <UsernameInput onSubmit={(name) => { handleUsernameSubmit(name) }} />;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}