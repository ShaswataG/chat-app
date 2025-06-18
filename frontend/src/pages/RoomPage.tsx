import { use, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addMessage, setMessages } from '../redux/chats/chatSlice';
import MessageInput from '../components/custom/others/MessageInput';

let socket: WebSocket;

export default function RoomPage() {
  const { id: roomId } = useParams();
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages[roomId!] || []);
//   const username = useAppSelector(state => state.room.currentRoom?.name || '');
  const { name: roomName } = useAppSelector(state => state.room.currentRoom || { name: '' });
  const { name:username } = useAppSelector(state => state.user);

  useEffect(() => {
    if (!roomId) return;

    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', username, room: roomId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        dispatch(setMessages({ room: data.room, messages: data.messages }));
      } else if (data.type === 'message') {
        dispatch(addMessage(data));
      }
    };

    // return () => {
    //   socket.send(JSON.stringify({ type: 'leave', room: roomId }));
    //   socket.close();
    // };
  }, [roomId]);

  const handleSend = (message: string) => {
    socket.send(JSON.stringify({ type: 'message', message, room: roomId }));
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">Room: {roomName}</h2>
      <ul className="space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="p-2 bg-gray-100 rounded">
            <b>{msg.username}</b>: {msg.message}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}