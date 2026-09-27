import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Homepage from './pages/Homepage.jsx';
import EventDetails from './pages/EventDetails.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
