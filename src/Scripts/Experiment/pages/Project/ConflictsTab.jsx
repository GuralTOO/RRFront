import React, { useState, useEffect } from 'react';
import { Table, Spin, message, Tooltip } from 'antd';
import { listConflicts } from '@/api/reviewsAPI'; // Adjust the import path as needed
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const ConflictsTab = ({ projectId }) => {
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConflicts();
    }, [projectId]);

    const fetchConflicts = async () => {
        try {
            const data = await listConflicts(projectId);
            setConflicts(data);
        } catch (error) {
            console.error('Error fetching conflicts:', error);
            message.error('Failed to fetch conflicts');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Paper Title',
            dataIndex: 'paper_title',
            key: 'paper_title',
            render: (text, record) => (
                <a href={`/papers/${record.paper_id}`} target="_blank" rel="noreferrer">
                    {text}
                </a>
            ),
            width: '70%',
        },
        {
            title: 'Conflict Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => {
                const localTime = dayjs.utc(text).local();
                const now = dayjs();

                return (
                    <Tooltip title={localTime.format('YYYY-MM-DD HH:mm:ss z')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <span style={{ fontWeight: 'bold' }}>{localTime.from(now)}</span>
                            <span style={{ fontSize: '0.9em', marginTop: '4px' }}>{localTime.format('MMM D')}</span>
                        </div>
                    </Tooltip>
                );
            },
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            width: '30%',
        },
    ];

    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    dataSource={conflicts}
                    columns={columns}
                    rowKey="conflict_id"
                />
            )}
        </div>
    );
};

export default ConflictsTab;