import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, FolderOpen, FileText, Settings } from 'lucide-react';
import './Navigation.css';
import { ConfigProvider } from 'antd';

const Navigation = ({ session }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <nav>
                        <ul>
                            <li><Link to="/dashboard"><Home size={20} />{!collapsed && <span>Dashboard</span>}</Link></li>
                            <li><Link to="/projects"><FolderOpen size={20} />{!collapsed && <span>All Projects</span>}</Link></li>
                            <li><Link to="/papers"><FileText size={20} />{!collapsed && <span>All Papers</span>}</Link></li>
                            <li><Link to="/settings"><Settings size={20} />{!collapsed && <span>Settings</span>}</Link></li>
                        </ul>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </ConfigProvider>
    );
}

export default Navigation;