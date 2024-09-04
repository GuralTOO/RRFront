import React, { useState, useEffect } from 'react';
import DocumentRow from './DocumentRow';
import { getFilteredPapers } from '@/api/papersApi';
import AddPaperModal from './Experiment/pages/Project/AddPaperModal';
import { addPaper } from '@/api/papersApi';
import { Spin, Typography } from 'antd';
import {
    Select, SelectTrigger,
    SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Table, TableCaption
    , TableHeader, TableRow, TableHead, TableBody
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
const { Title, Paragraph, Text } = Typography;

const DocumentList = ({ projectId }) => {
    const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
    const [filterDecision, setFilterDecision] = useState('all');
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
            const result = await getFilteredPapers(
                projectId,
                filterDecision,
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
    }, [projectId, sortConfig, currentPage, filterDecision]);

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
        } else if (field === 'createdAt') {
            field = 'created_at';
        } else if (field === 'title') {
            field = 'title';
        }
        console.log('Sort by:', field, order);
        setSortConfig({ field, ascending: order === 'asc' });
        setCurrentPage(1);
    };

    const handleFilterChange = (value) => {
        setFilterDecision(value);
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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Affiliated Papers</h3>
                <AddPaperModal onAddPaper={handleAddPaper} />
            </div>

            <div className="flex justify-between items-center mb-4">
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
                <div className="flex items-center space-x-2">
                    <Label htmlFor="filter">Filter by:</Label>
                    <Select onValueChange={handleFilterChange} value={filterDecision}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Papers</SelectItem>
                            <SelectItem value="unreviewed">Unreviewed</SelectItem>
                            <SelectItem value="accept">Accepted</SelectItem>
                            <SelectItem value="reject">Rejected</SelectItem>
                            <SelectItem value="skip">Skipped</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                                <TableHead>Review Decision</TableHead>
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