import React, { useState, useEffect } from 'react';
// import './DocumentList.css';
import DocumentRow from './DocumentRow';
// import { Select, Spin, Pagination } from "antd";
// import * as Label from '@radix-ui/react-label';
import { getUnreviewedPapers } from '@/api/papersApi';
import AddPaperModal from './Experiment/pages/Project/AddPaperModal';
import { addPaper } from '@/api/papersApi';

import { Spin } from 'antd';
import {
    Select, SelectTrigger,
    SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Table, TableCaption
    , TableHeader, TableRow, TableHead, TableBody
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";


const { Option } = Select;

// const DocumentList = ({ projectId }) => {
//     const [sortType, setSortType] = useState('created_at');
//     // const [ascending, setAscending] = useState(false);
//     const [expandedIndex, setExpandedIndex] = useState(null);
//     const [documents, setDocuments] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalDocuments, setTotalDocuments] = useState(0);
//     const pageSize = 50;


// const fetchDocuments = async (page = 1) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//         const result = await getUnreviewedPapers(projectId, sortType, ascending, page, pageSize);
//         setDocuments(result.data);
//         setTotalDocuments(result.totalCount);
//     } catch (error) {
//         console.error('Error fetching documents:', error);
//         setError('Failed to load documents. Please try again.');
//     } finally {
//         setIsLoading(false);
//     }
// };


// useEffect(() => {
//     fetchDocuments();
// }, [projectId, sortType, ascending]);

// const handleAddPaper = async (paperData) => {
//     // TODO: Implement the API call to add the paper to the database
//     console.log('Adding paper:', paperData);
//     // call the API to add the paper
//     await addPaper(paperData, projectId);
//     // After successfully adding the paper, you might want to refresh the document list
//     fetchDocuments();
// };

// const handleSortChange = (value) => {
//     let newSortType, newAscending;

//     switch (value) {
//         case 'title_asc':
//             newSortType = 'title';
//             newAscending = true;
//             break;
//         case 'title_desc':
//             newSortType = 'title';
//             newAscending = false;
//             break;
//         case 'created_at_asc':
//             newSortType = 'created_at';
//             newAscending = true;
//             break;
//         case 'created_at_desc':
//             newSortType = 'created_at';
//             newAscending = false;
//             break;
//         case 'publication_date_asc':
//             newSortType = 'publication_date';
//             newAscending = true;
//             break;
//         case 'publication_date_desc':
//             newSortType = 'publication_date';
//             newAscending = false;
//             break;
//         case 'relevancy_score_asc':
//             newSortType = 'relevancy_score';
//             newAscending = true;
//             break;
//         case 'relevancy_score_desc':
//             newSortType = 'relevancy_score';
//             newAscending = false;
//             break;
//         default:
//             newSortType = 'created_at';
//             newAscending = false;
//     }

//     setSortType(newSortType);
//     setAscending(newAscending);
//     setCurrentPage(1);
// };

// const handlePageChange = (page) => {
//     setCurrentPage(page);
//     fetchDocuments(page);
// };

// const toggleExpand = (index) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
// };

// if (error) return <div>Error: {error}</div>;

// return (
//     <div className="document-list-container">
//         <AddPaperModal onAddPaper={handleAddPaper} />
//         <div className="sort-dropdown">
//             <Label.Root htmlFor="sort" className='LabelRoot'>
//                 Sort by:
//             </Label.Root>
//             <Select
//                 id="sort"
//                 value={`${sortType}_${ascending ? 'asc' : 'desc'}`}
//                 onChange={handleSortChange}
//                 style={{ width: 220 }}
//             >
//                 <Option value="created_at_desc">Date Uploaded (Newest)</Option>
//                 <Option value="created_at_asc">Date Uploaded (Oldest)</Option>
//                 <Option value="publication_date_desc">Date of Publishing (Newest)</Option>
//                 <Option value="publication_date_asc">Date of Publishing (Oldest)</Option>
//                 <Option value="title_asc">Title (A-Z)</Option>
//                 <Option value="title_desc">Title (Z-A)</Option>
//                 <Option value="relevancy_score_desc">Relevance (High to Low)</Option>
//                 <Option value="relevancy_score_asc">Relevance (Low to High)</Option>
//             </Select>
//         </div>
//         {isLoading ? (
//             <Spin size="large" />
//         ) : (
//             <>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Title</th>
//                             <th>Date of Pub.</th>
//                             <th>Authors</th>
//                             <th>RR score</th>
//                             <th>Abstract</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {documents.map((doc, index) => (
//                             <DocumentRow
//                                 key={doc.paper_id}
//                                 doc={doc}
//                                 index={index}
//                                 expandedIndex={expandedIndex}
//                                 toggleExpand={toggleExpand}
//                             />
//                         ))}
//                     </tbody>
//                 </table>
//                 <Pagination
//                     current={currentPage}
//                     total={totalDocuments}
//                     pageSize={pageSize}
//                     onChange={handlePageChange}
//                     showSizeChanger={false}
//                 />
//             </>
//         )}
//     </div>
// );
const DocumentList = ({ projectId }) => {
    const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const pageSize = 50;

    const fetchDocuments = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getUnreviewedPapers(
                projectId,
                sortConfig.field,
                sortConfig.ascending,
                page,
                pageSize
            );
            setDocuments(result.data);
            setTotalDocuments(result.totalCount);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError('Failed to load documents. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments(currentPage);
    }, [projectId, sortConfig, currentPage]);

    const handleAddPaper = async (paperData) => {
        await addPaper(paperData, projectId);
        fetchDocuments(currentPage);
    };

    const handleSortChange = (value) => {
        let [field, order] = value.split('_');
        if (field === 'relevancyScore') {
            field = 'relevancy_score';
        } else if (field === 'publicationDate') {
            field = 'publication_date';
        }
        else if (field === 'createdAt') {
            field = 'created_at';
        }
        else if (field === 'title') {
            field = 'title';
        }
        console.log('Sort by:', field, order);
        setSortConfig({ field, ascending: order === 'asc' });
        setCurrentPage(1);
    };

    const getSelectValue = (field, ascending) => {
        let selectField = field;
        if (field === 'relevancy_score') {
            selectField = 'relevancyScore';
        } else if (field === 'publication_date') {
            selectField = 'publicationDate';
        } else if (field === 'created_at') {
            selectField = 'createdAt';
        }
        return `${selectField}_${ascending ? 'asc' : 'desc'}`;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const totalPages = Math.ceil(totalDocuments / pageSize);

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="sort">Sort by:</Label>
                    <Select onValueChange={handleSortChange} value={getSelectValue(sortConfig.field, sortConfig.ascending)}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Select sorting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt_desc">Date Uploaded (Newest)</SelectItem>
                            <SelectItem value="createdAt_asc">Date Uploaded (Oldest)</SelectItem>
                            <SelectItem value="publicationDate_desc">Date of Publishing (Newest)</SelectItem>
                            <SelectItem value="publicationDate_asc">Date of Publishing (Oldest)</SelectItem>
                            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                            <SelectItem value="relevancyScore_desc">Relevance (High to Low)</SelectItem>
                            <SelectItem value="relevancyScore_asc">Relevance (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AddPaperModal onAddPaper={handleAddPaper} />
            </div>

            {isLoading ? (
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table>
                        <TableCaption>List of papers for review</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Authors</TableHead>
                                <TableHead>Date of Pub.</TableHead>
                                <TableHead>RR score</TableHead>
                                {/* <TableHead>Abstract</TableHead> */}
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc, index) => (
                                <DocumentRow
                                    key={doc.paper_id}
                                    doc={doc}
                                    index={index}
                                    expandedIndex={expandedIndex}
                                    toggleExpand={toggleExpand}
                                />
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default DocumentList;