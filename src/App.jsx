import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { supabase } from './supabaseClient'
import './App.css'
import Navigation from './Scripts/Experiment/Navigation'
import LandingPage from './Scripts/LandingPage/LandingPage'
import Auth from './Auth'
import Dashboard from './Scripts/Experiment/pages/Dashboard';
import AllProjects from './Scripts/Experiment/pages/AllProjects';
import AllPapers from './Scripts/Experiment/pages/AllPapers';
import SettingsPage from './Scripts/Experiment/pages/Settings';
import ProjectDetails from './Scripts/Experiment/pages/Project/ProjectDetails';
import TinderForAbstracts from './Scripts/Experiment/pages/Project/Tinder/TinderForAbstracts';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    console.log('App component mounted')
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed. New session:', session)
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    console.log('Current session state:', session)
  }, [session])

  return (
    <Router>
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
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          ) : (
            <Route path="/*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App


// TODO:

// 1. Make TinderForAbstracts work for a specific project. Build the API to add reviews
// 2. Call the Google Cloud Function using some bearer token

