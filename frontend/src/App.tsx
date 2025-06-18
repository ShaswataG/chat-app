import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
