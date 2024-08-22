import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    // Mock data for projects and papers
    const projectsData = [
        { name: 'Project A', papers: 1500 },
        { name: 'Project B', papers: 2300 },
        { name: 'Project C', papers: 800 },
        { name: 'Project D', papers: 3100 },
    ];

    const totalPapers = projectsData.reduce((sum, project) => sum + project.papers, 0);

    return (
        <>
            <h1>Research Paper Tracker</h1>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="card">
                    <h2>Total Projects</h2>
                    <p>{projectsData.length}</p>
                </div>
                <div className="card">
                    <h2>Total Papers</h2>
                    <p>{totalPapers}</p>
                </div>
                <div className="card">
                    <h2>Avg Papers/Project</h2>
                    <p>{Math.round(totalPapers / projectsData.length)}</p>
                </div>
            </div>

            {/* Project Chart */}
            <div className="chart-container">
                <h2>Papers per Project</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="papers" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <ul>
                    <li>
                        <span>Added 5 papers to Project A</span>
                        <span className="timestamp">2 hours ago</span>
                    </li>
                    <li>
                        <span>Created new project: Project D</span>
                        <span className="timestamp">1 day ago</span>
                    </li>
                    <li>
                        <span>Removed 2 papers from Project B</span>
                        <span className="timestamp">2 days ago</span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Dashboard;