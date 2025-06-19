import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { signupThunk, signinThunk } from '../../../redux/users/userThunk';

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector(state => state.user);

  const handleSubmit = () => {
    if (isSignup) {
      dispatch(signupThunk({ name, password }));
    } else {
      dispatch(signinThunk({ name, password }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-8 border rounded shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>

      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Submitting...' : isSignup ? 'Sign Up' : 'Login'}
      </button>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}