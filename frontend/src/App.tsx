import './App.css'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import RoomPage from './pages/RoomPage'
import NotFound from './pages/NotFound'
import AuthPage from './pages/AuthPage';
import { useAppSelector } from './redux/hooks';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { id } = useAppSelector(state => state.user);
  return id ? <>{children}</> : <Navigate to="/auth" replace />;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route
            path="room/:id"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
