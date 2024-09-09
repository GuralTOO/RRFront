import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, FolderOpen, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { ConfigProvider, Tooltip } from 'antd';
import './Navigation2.css';
import logoImage from '/src/assets/RR_logo.png';

const NavItem = ({ to, icon: Icon, label, isActive, collapsed }) => (
    <Tooltip title={collapsed ? label : ''} placement="right">
        <li className={isActive ? 'active' : ''}>
            <Link to={to}>
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
            </Link>
        </li>
    </Tooltip>
);

const Navigation2 = ({ session }) => {
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    const navItems = [
        { to: "/dashboard", icon: Home, label: "Dashboard" },
        { to: "/projects", icon: FolderOpen, label: "Projects" },
        { to: "/papers", icon: FileText, label: "All Papers" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

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
                    <div className="sidebar-header">
                        <img src={logoImage} alt="Logo" className="logo" />
                        {!collapsed && <h1 className="app-name">RapidReview</h1>}
                    </div>
                    <nav>
                        <ul>
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.to}
                                    {...item}
                                    isActive={location.pathname === item.to}
                                    collapsed={collapsed}
                                />
                            ))}
                        </ul>
                    </nav>
                    <button
                        className="collapse-button"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </aside>
                {/* Main Content */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </ConfigProvider>
    );
}

export default Navigation2;