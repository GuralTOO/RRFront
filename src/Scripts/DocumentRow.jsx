// import React from 'react';
// import { ChevronDownIcon, ChevronUpIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Table } from "@/components/ui/table";

// const DocumentRow = ({ doc, index, expandedIndex, toggleExpand }) => {
//   const isExpanded = expandedIndex === index;

//   return (
//     <>
//       <Table.Row className={`transition-all duration-200 ${isExpanded ? 'bg-gray-50' : ''}`}>
//         <Table.Cell>{doc.title}</Table.Cell>
//         <Table.Cell>{doc.publication_date}</Table.Cell>
//         <Table.Cell>{doc.authors}</Table.Cell>
//         <Table.Cell>
//           <Progress value={doc.relevancy_score * 10} className="w-full" />
//         </Table.Cell>
//         <Table.Cell className={`${isExpanded ? '' : 'truncate max-w-xs'}`}>
//           {isExpanded ? doc.abstract : `${doc.abstract.substring(0, 100)}...`}
//         </Table.Cell>
//         <Table.Cell>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => toggleExpand(index)}
//           >
//             {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
//           </Button>
//         </Table.Cell>
//       </Table.Row>
//       {isExpanded && (
//         <Table.Row className="bg-gray-50">
//           <Table.Cell colSpan={6} className="p-4">
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{doc.title}</h3>
//                 <div className="space-x-2">
//                   <Button variant="outline" size="sm">
//                     <FileTextIcon className="mr-2 h-4 w-4" />
//                     View Full Text
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <MessageSquareIcon className="mr-2 h-4 w-4" />
//                     Add Comment
//                   </Button>
//                 </div>
//               </div>
//               <div className="text-sm text-gray-500">
//                 <span className="mr-4">Authors: {doc.authors}</span>
//                 <span>Published: {doc.publication_date}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium">Relevancy Score:</span>
//                 <Progress value={doc.relevancy_score * 10} className="w-24" />
//                 <span className="text-sm text-gray-500">{doc.relevancy_score}</span>
//               </div>
//               <p className="text-sm">{doc.abstract}</p>
//               {/* Add more details or components here as needed */}
//             </div>
//           </Table.Cell>
//         </Table.Row>
//       )}
//     </>
//   );
// };

// export default DocumentRow;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const DocumentRow = ({ doc, projectId, index, expandedIndex, toggleExpand }) => {
    const [isExpanded, setIsExpanded] = useState(expandedIndex === index);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const [showFullText, setShowFullText] = useState(false);

    const formatAuthorName = (authorString) => {
        const [lastName, firstName] = authorString.split(',').map(part => part.trim());
        return `${firstName} ${lastName}`;
    };

    const truncate = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };
      
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        toggleExpand(index);
    };

    const handleAddComment = () => {
        // Dummy function to handle adding a comment
        console.log('Adding comment:', comment);
        // Here you would typically send this to your backend
        setComment('');
        setShowCommentBox(false);
    };

    const formattedAuthors = doc.authors.map(formatAuthorName);

    return (
        <>
            <TableRow className={`transition-all duration-200 ${isExpanded ? 'bg-gray-50' : ''}`}>
                <TableCell className="w-1/3 max-w-0 truncate" title={doc.title}>
                    {truncate(doc.title, 50)}
                </TableCell>
                <TableCell className="w-1/4 max-w-0 truncate" title={formattedAuthors.join(', ')}>
                    {truncate(formattedAuthors.join(', '), 50)}
                </TableCell>
                <TableCell className="w-1/6">{doc.publication_date}</TableCell>
                <TableCell className="w-1/6">
                    <div className="flex items-center space-x-2">
                        <Progress value={doc.relevancy_score * 10} className="w-full max-w-[100px]" />
                        <span className="text-sm text-gray-500">{doc.relevancy_score}</span>
                    </div>
                </TableCell>
                <TableCell className="w-1/6">
                    {doc.review_decision}
                </TableCell>
                <TableCell className="w-12 text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleExpand}
                    >
                        {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    </Button>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow className="bg-gray-50">
                    <TableCell colSpan={5} className="p-4">
                        <div className="space-y-4">
                            {doc.title.length > 50 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Full Title</h4>
                                    <p className="text-sm">{doc.title}</p>
                                </div>
                            )}
                            {formattedAuthors.length > 50 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">All Authors</h4>
                                    <p className="text-sm">{formattedAuthors.join(', ')}</p>
                                </div>
                            )}
                            <div className="max-w-3xl">
                                <h4 className="text-sm font-medium text-gray-500">Abstract</h4>
                                <p className="text-sm text-gray-700">{doc.abstract}</p>
                            </div>
                            {doc.comments && doc.comments.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Comments</h4>
                                    {doc.comments.map((comment, idx) => (
                                        <p key={idx} className="text-sm text-gray-700">{comment}</p>
                                    ))}
                                </div>
                            )}
                            {showCommentBox ? (
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Type your comment here."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={handleAddComment}>Submit Comment</Button>
                                        <Button size="sm" variant="outline" onClick={() => setShowCommentBox(false)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <Button variant="outline" size="sm" onClick={() => setShowCommentBox(true)}>
                                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                                        Add Comment
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/p/${projectId}/papers/${doc.paper_id}`)}
                                    >
                                        <FileTextIcon className="mr-2 h-4 w-4" />
                                        View Full Text
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default DocumentRow;