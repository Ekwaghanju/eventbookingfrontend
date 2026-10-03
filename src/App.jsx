import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Homepage from './pages/Homepage.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import Legal from './pages/Legal.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { OrganizerAuthProvider } from './auth/OrganizerAuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import About from './pages/About.jsx';
import OrganizerDashboard from './pages/OrganizerPages/OrganizerDashboard.jsx';
import OrganizerAuthPage from './pages/OrganizerPages/OrganizerAuthPage.jsx';
import OrganizerEventDetails from './pages/OrganizerPages/OrganizerEventDetails.jsx';
import OrganizerEventForm from './pages/OrganizerPages/OrganizerEventForm.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <AuthProvider>
          <OrganizerAuthProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/terms" element={<Legal />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/login" element={<OrganizerAuthPage />} />
              <Route path="/organizer/signup" element={<OrganizerAuthPage />} />
              <Route path="/organizer/events/new" element={<OrganizerEventForm />} />
              <Route path="/organizer/events/:id/edit" element={<OrganizerEventForm />} />
              <Route path="/organizer/events/:id" element={<OrganizerEventDetails />} />
            </Routes>
          </OrganizerAuthProvider>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
