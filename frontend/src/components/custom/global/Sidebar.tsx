import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { leaveRoom, setCurrentRoom } from '../../../redux/rooms/roomSlice';
import { type Room } from '../../../redux/rooms/roomSlice';
import { useState } from 'react';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: currentRoomId } = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const { allRooms } = useAppSelector(state => state.room);

  const handleNavigate = (room: Room) => {
    dispatch(setCurrentRoom(room)); 
    navigate(`/room/${room.id}`);
  };

  const handleLeave = () => {
    if (currentRoomId) {
      dispatch(leaveRoom(currentRoomId));
      navigate('/');
    }
  };

  return (
    <div className={`transition-all duration-300 h-screen bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <span className="font-bold text-lg">{!collapsed && 'Rooms'}</span>
        <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '➡️' : '⬅️'}</button>
      </div>
      <div className="overflow-y-auto flex-1">
        {allRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleNavigate(room)}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-600 ${room.id === currentRoomId ? 'bg-gray-700' : ''}`}
          >
            {!collapsed && room.name}
          </div>
        ))}
      </div>
      {currentRoomId && (
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white p-2 m-4 rounded hover:bg-red-600"
        >
          Leave Room
        </button>
      )}
    </div>
  );
}