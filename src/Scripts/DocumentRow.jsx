import React from 'react';
import { RowSpacingIcon, Cross2Icon } from '@radix-ui/react-icons';
import './DocumentRow.css';

const DocumentRow = ({ doc, index, expandedIndex, toggleExpand }) => {
    const isExpanded = expandedIndex === index;

    return (
        <>
            <tr>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="IconButton" onClick={() => toggleExpand(index)}>
                            {isExpanded ? <Cross2Icon /> : <RowSpacingIcon />}
                        </button>
                        {doc.title}
                    </div>
                </td>
                <td>{doc.date}</td>
                <td>{doc.authors}</td>
                <td>{doc.relevance}</td>
                <td className="abstract-cell">{isExpanded ? doc.abstract : doc.abstract.substring(0, 50) + '...'}</td>
            </tr>
            {isExpanded && (
                <tr className="expanded-row">
                    <td colSpan="5">
                        <div className="expanded-details">
                            <p><strong>Title:</strong> {doc.title}</p>
                            <p><strong>Abstract:</strong> {doc.abstract}</p>
                            <p><strong>Date of Pub.:</strong> {doc.date}</p>
                            <p><strong>Authors:</strong> {doc.authors}</p>
                            <p><strong>RR score:</strong> {doc.relevance}</p>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default DocumentRow;
