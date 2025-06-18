import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addMessage, setMessages } from '../redux/chats/chatSlice';
import { joinRoom } from '../redux/rooms/roomSlice';
import UsernameInput from '../components/custom/global/UsernameInput';
import MessageInput from '../components/custom/others/MessageInput';

let socket: WebSocket;

export default function Home() {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages[currentRoom] || []);

  const initSocket = (name: string) => {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', username: name, room: currentRoom }));
      dispatch(joinRoom(currentRoom));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        dispatch(setMessages({ room: data.room, messages: data.messages }));
      } else if (data.type === 'message') {
        dispatch(addMessage(data));
      }
    };
  };

  const handleSend = (message: string) => {
    socket.send(JSON.stringify({ type: 'message', message, room: currentRoom }));
  };

  if (!username) return <UsernameInput onSubmit={(name) => {
    setUsername(name);
    initSocket(name);
  }} />;

  return (
    <div>
      <h2>Room: {currentRoom}</h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}><b>{msg.username}</b>: {msg.message}</li>
        ))}
      </ul>
      <MessageInput onSend={handleSend} />
    </div>
  );
}
