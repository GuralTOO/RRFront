import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient'
import './App.css'

// Public Pages
import LandingPage5 from './Scripts/LandingPage/LandingPage5';
import Auth from './Auth'
import InterestForm from './Scripts/InterestForm/InterestForm';

// Outside Project Pages
import AllProjects from './Scripts/Experiment/pages/AllProjects';
import SearchPage from './Scripts/Search/SearchPage';
import DocumentationPage from './Scripts/Documentation/DocumentationPage';
import UserSettingsPage from './Scripts/Settings/UserSettingsPage';

// Project Pages
import ProjectHome from './Scripts/Project/Pages/ProjectHome.jsx';
import FullTextViewer from './Scripts/Document/FullTextViewer';
import TinderForAbstracts from './Scripts/Experiment/pages/Project/Tinder/TinderForAbstracts';
import FullTextReview from './Scripts/Experiment/pages/Project/FullText/FullTextReview';
import DataExtractionPage from './Scripts/Project/Pages/DataExtraction/DataExtractionPage';
import CriteriaPage from './Scripts/Project/Pages/Criteria/CriteriaPage';
import ImportPage from './Scripts/Project/Pages/Import/ImportPage';
import ExportPage from './Scripts/Project/Pages/Export/ExportPage';
import ProjectSettingsPage from './Scripts/Project/Pages/Settings/SettingsPage';
import PapersPage from './Scripts/Project/Pages/Papers/PapersPage';

import AppLayout from './Scripts/layout/AppLayout';
import ConflictsPage from './Scripts/Project/Pages/Conflicts/ConflictsPage';
import FullTextViewer_old from './Scripts/Document/FullTextViewer_old';

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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage5 />} />
        <Route path="/hiddenlogin" element={<Auth />} />
        <Route path="/login" element={<InterestForm />} />

        {session ? (
        <Route path="/*" element={<AppLayout session={session} />}>
            {/* Outside Project Routes */}
            <Route path="projects" element={<AllProjects />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="docs" element={<DocumentationPage />} />
            <Route path="account" element={<UserSettingsPage />} />

            {/* Project Routes */}
            <Route path="p/:projectId">
              <Route index element={<ProjectHome />} />
              <Route path="papers">
                <Route index element={<PapersPage />} />
                <Route path=":paperId" element={<FullTextViewer />} />
              </Route>
              <Route path="criteria" element={<CriteriaPage />} />
              
              {/* Review Queues */}
              <Route path="review">
                <Route path="abstract" element={<TinderForAbstracts />} />
                <Route path="fulltext" element={<FullTextReview />} />
                <Route path="extraction" element={<DataExtractionPage />} />
                <Route path="conflicts" element={<ConflictsPage />} />
              </Route>

              {/* Project Management */}
              <Route path="import" element={<ImportPage />} />
              <Route path="export" element={<ExportPage />} />
              <Route path="settings" element={<ProjectSettingsPage />} />
            </Route>

            {/* Redirect /dashboard to /projects for now */}
            <Route path="dashboard" element={<Navigate to="/projects" replace />} />
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