import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const PapersHeader = ({
    onSearchChange,
    onSortChange,
    onStageChange,
    onStatusChange,
    onRelevanceRangeChange,
    onDateRangeChange
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [relevanceRange, setRelevanceRange] = useState([0, 9.9]);
    const [selectedStage, setSelectedStage] = useState('all');
    const [dateRange, setDateRange] = useState(['', '']);

    const handleStageChange = (value) => {
        setSelectedStage(value);
        onStageChange(value);
        if (value === 'all') {
            onStatusChange('all');
        }
    };

    return (
        <div className="bg-white">
            <div className="max-w-[1920px] mx-auto px-6">
                {/* Primary Row */}
                <div className="h-20 flex items-center gap-4">
                    {/* Custom Search Bar */}
                    <div className="relative flex-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-gray-50/80 rounded-lg" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Search across title, abstract, and authors..."
                                className="w-full pl-12 pr-4 h-14 text-base bg-transparent rounded-lg 
                                         shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative z-0
                                         placeholder:text-gray-400 outline-none"
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <Select onValueChange={onSortChange}>
                        <SelectTrigger className="w-[140px] border-none bg-gray-50">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent align="start">
                            <SelectItem value="createdAt_desc">Upload Date (Newest)</SelectItem>
                            <SelectItem value="createdAt_asc">Upload Date (Oldest)</SelectItem>
                            <SelectItem value="publicationDate_desc">Publishing Date (Newest)</SelectItem>
                            <SelectItem value="publicationDate_asc">Publishing Date (Oldest)</SelectItem>
                            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                            <SelectItem value="relevancyScore_desc">Relevance (High to Low)</SelectItem>
                            <SelectItem value="relevancyScore_asc">Relevance (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Filter Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-10 h-10 ${showFilters ? 'bg-blue-50 text-blue-600' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="py-4">
                        <div className="grid grid-cols-12 gap-6 items-center">
                            <div className="col-span-2">
                                <div className="text-xs font-medium text-gray-500 mb-1.5">Review Stage</div>
                                <Select value={selectedStage} onValueChange={handleStageChange}>
                                    <SelectTrigger className="border-none bg-gray-50">
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Papers</SelectItem>
                                        <SelectItem value="abstract">Abstract Screening</SelectItem>
                                        <SelectItem value="fulltext">Full-Text Review</SelectItem>
                                        <SelectItem value="extraction">Data Extraction</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <div className="text-xs font-medium text-gray-500 mb-1.5">Paper Status</div>
                                <Select onValueChange={onStatusChange} disabled={selectedStage === 'all'}>
                                    <SelectTrigger className={`border-none bg-gray-50 
                                        ${selectedStage === 'all' ? 'opacity-50' : ''}`}>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Papers</SelectItem>
                                        <SelectItem value="in_review">In Review</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-4">
                                <div className="text-xs font-medium text-gray-500 mb-1.5">
                                    Relevance Score Range
                                </div>
                                <div className="flex items-center gap-3 px-2">
                                    <div className="text-sm tabular-nums w-16">
                                        {relevanceRange[0].toFixed(1)} - {relevanceRange[1].toFixed(1)}
                                    </div>
                                    <Slider
                                        value={[relevanceRange[0] * 10, relevanceRange[1] * 10]}
                                        max={99}
                                        step={1}
                                        minStepsBetweenThumbs={1}
                                        onValueChange={(values) => {
                                            const newRange = [values[0] / 10, values[1] / 10];
                                            setRelevanceRange(newRange);
                                            onRelevanceRangeChange(newRange);
                                        }}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="text-xs font-medium text-gray-500 mb-1.5">Publication Period</div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="date"
                                        className="border-none bg-gray-50"
                                        value={dateRange[0]}
                                        onChange={(e) => {
                                            const newRange = [e.target.value, dateRange[1]];
                                            setDateRange(newRange);
                                            onDateRangeChange(newRange);
                                        }}
                                    />
                                    <span className="text-gray-400">to</span>
                                    <Input
                                        type="date"
                                        className="border-none bg-gray-50"
                                        value={dateRange[1]}
                                        onChange={(e) => {
                                            const newRange = [dateRange[0], e.target.value];
                                            setDateRange(newRange);
                                            onDateRangeChange(newRange);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PapersHeader;