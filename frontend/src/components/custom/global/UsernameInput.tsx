import { useState } from 'react';

interface Props {
  onSubmit: (username: string) => void;
}

export default function UsernameInput({ onSubmit }: Props) {
  const [username, setUsername] = useState('');

  return (
    <div>
      <input
        placeholder="Enter username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={() => username && onSubmit(username)}>Join</button>
    </div>
  );
}
