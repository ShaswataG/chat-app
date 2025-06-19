import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addMessage, setMessages } from '../redux/chats/chatSlice';
import MessageInput from '../components/custom/others/MessageInput';
import JoinRoomModal from '../components/custom/global/JoinRoomModal'; 

let newSocket: WebSocket;

const sendWhenReady = (socket: WebSocket, data: any) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(data));
    }, { once: true }); // send only once when open
  }
};

export default function RoomPage() {
  const { id: roomId } = useParams();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages[roomId!] || []);
  const { name: roomName } = useAppSelector(state => state.room.currentRoom || { name: '' });
  const { id:userId, name:username } = useAppSelector(state => state.user);

  useEffect(() => {
    if (!roomId) return;

    newSocket = new WebSocket('ws://localhost:8080');
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      sendWhenReady(newSocket, { type: 'join', userId, roomId });
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        const messages = data.messages.map((message: any) => ({
          roomId: message.room_id,
          username: message?.user_id?.name,
          message: message?.message,
          timestamp: message?.timestamp
        }));
        dispatch(setMessages({ roomId: data.room, messages: messages }));
      } else if (data.type === 'message') {
        dispatch(addMessage(data));
      } else if (data.type === 'error') {
        console.error('Error from server:', data.message);
      } else if (data.type === 'needJoinConfirmation') {
        setPendingRoomId(data.roomId || null);
        setShowJoinModal(true);
      }
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      } else {
        // If not open yet, just close it silently
        newSocket.addEventListener('open', () => {
          newSocket.close();
        }, { once: true });
        return;
      }
    };
  }, [roomId]);

  const handleSend = (message: string) => {
      if (socketRef.current) {
        sendWhenReady(socketRef.current, { type: 'message', message, roomId: roomId, userId, username: username });
      }
  };

  const handleConfirmJoin = () => {
    if (pendingRoomId && socketRef.current) {
      sendWhenReady(socketRef.current, {
        type: 'confirmJoin',
        roomId: pendingRoomId,
        userId,
      });
    }
    setShowJoinModal(false);
  };
  
  const handleCancelJoin = () => {
    setShowJoinModal(false);
    setPendingRoomId(null);
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
      <JoinRoomModal
        isOpen={showJoinModal}
        onConfirm={handleConfirmJoin}
        onCancel={handleCancelJoin}
      />
    </div>
  );
}