import { useState } from 'react';

interface Props {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [message, setMessage] = useState('');

  return (
    <div>
      <input
        placeholder="Type message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={() => {
        if (message.trim()) {
          onSend(message);
          setMessage('');
        }
      }}>Send</button>
    </div>
  );
}
