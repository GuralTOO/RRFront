import React, { useState } from 'react';
import './DocumentList.css';
import { documents as initialDocuments } from './documentData'; // Import the document data
import DocumentRow from './DocumentRow'; // Import the DocumentRow component
import { Select } from "antd";
import * as Label from '@radix-ui/react-label';

const { Option } = Select;

const DocumentList = () => {
    const [sortType, setSortType] = useState('Title');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [documents, setDocuments] = useState(initialDocuments);

    const handleSortChange = (value) => {
        setSortType(value);
        let sortedDocuments = [...documents];

        switch (value) {
            case 'Title':
                sortedDocuments.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'Date':
                sortedDocuments.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'Relevance':
                sortedDocuments.sort((a, b) => b.relevance - a.relevance);
                break;
            default:
                break;
        }

        setDocuments(sortedDocuments);
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="document-list-container">
            <div className="sort-dropdown">
                <Label.Root htmlFor="sort" className='LabelRoot'>
                    Sort by:
                </Label.Root>
                {/* <label htmlFor="sort">Sort by: </label> */}
                <Select id="sort" value={sortType} onChange={handleSortChange} style={{ width: 150 }}>
                    <Option value="Title">Title</Option>
                    <Option value="Date">Date of Publishing</Option>
                    <Option value="Relevance">Relevance</Option>
                </Select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date of Pub.</th>
                        <th>Authors</th>
                        <th>RR score</th>
                        <th>Abstract</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => (
                        <DocumentRow
                            key={index}
                            doc={doc}
                            index={index}
                            expandedIndex={expandedIndex}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentList;
