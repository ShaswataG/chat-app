import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RoomPage from './pages/RoomPage'
import NotFound from './pages/NotFound'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />}>
          <Route path="room/:id" element={<RoomPage />} />
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
