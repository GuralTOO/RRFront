import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient'
import './App.css'
import Navigation from './Scripts/Experiment/Navigation'
import LandingPage from './Scripts/LandingPage/LandingPage'
import Auth from './Auth'
import Dashboard from './Scripts/Experiment/pages/Dashboard';
import AllProjects from './Scripts/Experiment/pages/AllProjects';
import AllPapers from './Scripts/Experiment/pages/AllPapers';
import UserSettingsPage from './Scripts/Settings/UserSettingsPage';
import ProjectDetails from './Scripts/Experiment/pages/Project/ProjectDetails';
import TinderForAbstracts from './Scripts/Experiment/pages/Project/Tinder/TinderForAbstracts';

function App() {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function handleAuthChange() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setIsLoading(false)

      if (session) {
        const access_token = new URLSearchParams(window.location.hash.substring(1)).get('access_token')
        if (access_token) {
          window.history.replaceState(null, '', '/dashboard') // Clean up URL
          navigate('/dashboard', { replace: true })
        } else if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/dashboard', { replace: true })
        }
      }
    }

    handleAuthChange()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      handleAuthChange()
    })

    return () => subscription.unsubscribe()
  }, [navigate, location])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        {session ? (
          <Route path="/*" element={<Navigation session={session} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="projects/:projectId/review" element={<TinderForAbstracts />} />
            <Route path="papers" element={<AllPapers />} />
            <Route path="settings" element={<UserSettingsPage />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  )
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper