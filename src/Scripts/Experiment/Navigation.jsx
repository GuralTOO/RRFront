import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Home, FolderOpen, FileText, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AllProjects from './pages/AllProjects';
import AllPapers from './pages/AllPapers';
import SettingsPage from './pages/Settings';
import './Navigation.css';
import { ConfigProvider } from 'antd';
import ProjectDetails from './pages/Project/ProjectDetails';
import TinderForAbstracts from './pages/Project/Tinder/TinderForAbstracts';

const Navigation = () => {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <Router>
                <div className="dashboard-container">
                    {/* Sidebar */}
                    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                        <nav>
                            <ul>
                                <li><Link to="/"><Home size={20} />{!collapsed && <span>Dashboard</span>}</Link></li>
                                <li><Link to="/projects"><FolderOpen size={20} />{!collapsed && <span>All Projects</span>}</Link></li>
                                <li><Link to="/papers"><FileText size={20} />{!collapsed && <span>All Papers</span>}</Link></li>
                                <li><Link to="/settings"><Settings size={20} />{!collapsed && <span>Settings</span>}</Link></li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/projects" element={<AllProjects />} />
                            <Route path="/projects/:projectId" element={<ProjectDetails />} />
                            <Route path="/papers" element={<AllPapers />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/tinder" element={<TinderForAbstracts />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ConfigProvider>

    );
}

export default Navigation;