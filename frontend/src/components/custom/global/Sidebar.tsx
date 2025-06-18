import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { leaveRoom, setCurrentRoom, addRoom } from '../../../redux/rooms/roomSlice';
import { type Room } from '../../../redux/rooms/roomSlice';
import { useState, useEffect } from 'react';

// Place this at module scope to persist socket
let socket: WebSocket | null = null;

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: currentRoomId } = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const { allRooms } = useAppSelector(state => state.room);
  // If you store username in redux, adjust this selector:
  const username = useAppSelector(state => state.user?.name) || "Anonymous";

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  // WebSocket setup
  useEffect(() => {
    if (!socket) {
      socket = new WebSocket("ws://localhost:8080");
    }
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "newRoomCreated") {
        dispatch(addRoom({ id: data.message.id, name: data.message.name }));
        setShowPopup(false);
        setRoomName("");
        setError("");
      } else if (data.type === "error") {
        setError(data.message);
      }
    };
    socket.addEventListener("message", handleMessage);
    return () => {
      socket?.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

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

  // Handle create room
  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      return;
    }
    setError("");
    socket?.send(JSON.stringify({ type: "create", roomName, username }));
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
      {/* New Room Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-600 text-white p-2 m-4 rounded hover:bg-blue-700"
      >
        + New Room
      </button>
      {currentRoomId && (
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white p-2 m-4 rounded hover:bg-red-600"
        >
          Leave Room
        </button>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Create New Room</h2>
            <input
              className="w-full p-2 mb-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Room name"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => { setShowPopup(false); setRoomName(""); setError(""); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}