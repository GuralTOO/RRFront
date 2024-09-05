import React from 'react';
import { Card, Row, Col, Typography, List, Badge } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectOutlined, FileTextOutlined, CalculatorOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard2 = () => {
    // Mock data for projects and papers
    const projectsData = [
        { name: 'Project A', papers: 1500 },
        { name: 'Project B', papers: 2300 },
        { name: 'Project C', papers: 800 },
        { name: 'Project D', papers: 3100 },
    ];

    const totalPapers = projectsData.reduce((sum, project) => sum + project.papers, 0);

    const recentActivity = [
        { action: 'Added 5 papers to Project A', timestamp: '2 hours ago' },
        { action: 'Created new project: Project D', timestamp: '1 day ago' },
        { action: 'Removed 2 papers from Project B', timestamp: '2 days ago' },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Title level={2} className="mb-6 text-blue-600">Research Paper Tracker</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card hoverable className="text-center shadow-md">
                        <ProjectOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <Title level={3}>{projectsData.length}</Title>
                        <p className="text-gray-500">Total Projects</p>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable className="text-center shadow-md">
                        <FileTextOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                        <Title level={3}>{totalPapers}</Title>
                        <p className="text-gray-500">Total Papers</p>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable className="text-center shadow-md">
                        <CalculatorOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                        <Title level={3}>{Math.round(totalPapers / projectsData.length)}</Title>
                        <p className="text-gray-500">Avg Papers/Project</p>
                    </Card>
                </Col>
            </Row>

            <Card className="mt-6 shadow-md">
                <Title level={4}>Papers per Project</Title>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="papers" fill="#1890ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card className="mt-6 shadow-md">
                <Title level={4}>Recent Activity</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={recentActivity}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.action}
                                description={item.timestamp}
                            />
                            <Badge status="processing" text="New" />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Dashboard2;