import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient'
import './App.css'
import Navigation from './Scripts/Experiment/Navigation'
import Navigation2 from './Scripts/Experiment/Navigation2';
import LandingPage from './Scripts/LandingPage/LandingPage'
import LandingPage2 from './Scripts/LandingPage/LandingPage2';
import LandingPage3 from './Scripts/LandingPage/LandingPage3';
import LandingPage4 from './Scripts/LandingPage/LandingPage4';
import LandingPage5 from './Scripts/LandingPage/LandingPage5';
import Auth from './Auth'
import Dashboard from './Scripts/Experiment/pages/Dashboard';
import Dashboard2 from './Scripts/Experiment/pages/Dashboard2';
import Dashboard3 from './Scripts/Experiment/pages/Dashboard3';
import Dashboard4 from './Scripts/Experiment/pages/Dashboard4';
import AllProjects from './Scripts/Experiment/pages/AllProjects';
import AllPapers from './Scripts/Experiment/pages/AllPapers';
import UserSettingsPage from './Scripts/Settings/UserSettingsPage';
import ProjectDetails from './Scripts/Experiment/pages/Project/ProjectDetails';
import TinderForAbstracts from './Scripts/Experiment/pages/Project/Tinder/TinderForAbstracts';
import FullTextReview from './Scripts/Experiment/pages/Project/FullText/FullTextReview';
import TinderForAbstractConflicts from './Scripts/Experiment/pages/Project/Tinder/TinderForAbstractConflicts';
import InterestForm from './Scripts/InterestForm/InterestForm';


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
        <Route path="/" element={<LandingPage5 />} />
        <Route path="/hiddenlogin" element={<Auth />} />
        <Route path="/login" element={<InterestForm />} />
        {session ? (
          <Route path="/*" element={<Navigation2 session={session} />}>
            <Route path="dashboard" element={<Dashboard3 />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="projects/:projectId/fulltextreview" element={<FullTextReview />} />
            <Route path="projects/:projectId/review" element={<TinderForAbstracts />} />
            <Route path="projects/:projectId/conflicts" element={<TinderForAbstractConflicts />} />
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