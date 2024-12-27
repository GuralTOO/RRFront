import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PapersHeader = ({ 
    onAddPaper,
    onSortChange,
    onFilterChange,
    sortConfig,
    filterDecision,
    projectId
}) => {
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

    return (
        <div className="bg-white border-b sticky top-0 z-10">
            <div className="px-6 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Select 
                            defaultValue={getSelectValue(sortConfig.field, sortConfig.ascending)}
                            onValueChange={onSortChange}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt_desc">Date Added (Newest)</SelectItem>
                                <SelectItem value="createdAt_asc">Date Added (Oldest)</SelectItem>
                                <SelectItem value="publicationDate_desc">Published (Newest)</SelectItem>
                                <SelectItem value="publicationDate_asc">Published (Oldest)</SelectItem>
                                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                                <SelectItem value="relevancyScore_desc">Relevance (High to Low)</SelectItem>
                                <SelectItem value="relevancyScore_asc">Relevance (Low to High)</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterDecision} onValueChange={onFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by..." />
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
            </div>
        </div>
    );
};

export default PapersHeader;