import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, User, ArrowUpCircle, ArrowDownCircle, ChevronLeft, ListOrdered } from 'lucide-react';

const ReviewQueue = ({ 
    papers = [], 
    currentIndex, 
    onSelectPaper, 
    decisions = {} 
}) => {
    const formatAuthors = (authors) => {
        if (!authors) return 'Unknown Authors';
        if (typeof authors === 'string') return authors;
        return authors.slice(0, 2).join(', ') + (authors.length > 2 ? ', et al.' : '');
    };

    const getDecisionStyles = (paperId) => {
        const decision = decisions[paperId];
        if (!decision) return {};
        
        return {
            accept: {
                backgroundColor: 'rgba(34, 197, 94, 0.05)'
            },
            reject: {
                backgroundColor: 'rgba(239, 68, 68, 0.05)'
            }
        }[decision] || {};
    };

    const getDecisionIcon = (paperId) => {
        const decision = decisions[paperId];
        if (!decision) return null;
        
        return {
            accept: <ArrowUpCircle className="w-5 h-5 text-green-500" />,
            reject: <ArrowDownCircle className="w-5 h-5 text-red-500" />
        }[decision];
    };

    return (
        <div className="w-20 hover:w-64 group transition-all duration-200 ease-in-out fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-50">
            {/* Header - Always visible */}
            <div className="flex h-16 items-center px-4 bg-white">
                <div className="flex items-center min-w-[40px] justify-center">
                    <ListOrdered className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="ml-3 flex-1 flex items-center overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="ml-2 font-medium text-sm text-gray-800">
                        Review Queue
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="h-[calc(100vh-4rem)] overflow-hidden">
                {/* Collapsed View */}
                <div className="absolute inset-0 top-16 flex flex-col px-2 py-3 group-hover:invisible">
                    <div className="space-y-2">
                        {papers.map((paper, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <div key={paper.paper_id} className="relative">
                                    <div 
                                        className={`
                                            h-12 rounded-md cursor-pointer transition-colors duration-200
                                            hover:bg-gray-50 flex items-center justify-center
                                            ${isActive ? 'bg-white' : 'bg-white'}
                                        `}
                                        style={getDecisionStyles(paper.paper_id)}
                                        onClick={() => onSelectPaper(index)}
                                    >
                                        {getDecisionIcon(paper.paper_id) || (
                                            <div className={`
                                                w-2 h-2 rounded-full 
                                                ${isActive ? 'bg-blue-500' : 'bg-gray-300'}
                                            `} />
                                        )}
                                    </div>
                                    {isActive && (
                                        <>
                                            {/* <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none" /> */}
                                            {/* <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-l" /> */}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expanded View */}
                <div className="absolute inset-0 top-16 invisible group-hover:visible overflow-y-auto">
                    <div className="px-4 py-3 space-y-3">
                        {papers.map((paper, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <div key={paper.paper_id} className="relative">
                                    <Card
                                        className={`
                                            h-24 relative overflow-hidden transition-colors duration-200 
                                            hover:bg-gray-50 cursor-pointer border
                                            ${isActive ? 'bg-blue-50' : ''}
                                        `}
                                        style={getDecisionStyles(paper.paper_id)}
                                        onClick={() => onSelectPaper(index)}
                                    >
                                        <div className="p-3 h-full flex flex-col justify-between">
                                            <div className="space-y-1 min-h-0">
                                                <div className="flex justify-between">
                                                    <h4 className="font-medium text-xs text-gray-900 line-clamp-2 flex-1 pr-2">
                                                        {paper.title}
                                                    </h4>
                                                    {getDecisionIcon(paper.paper_id) && (
                                                        <div className="shrink-0">
                                                            {getDecisionIcon(paper.paper_id)}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <User className="w-3 h-3 mr-1 shrink-0" />
                                                        <span className="truncate">
                                                            {formatAuthors(paper.authors)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Calendar className="w-3 h-3 mr-1 shrink-0" />
                                                        <span className="truncate">
                                                            {paper.publication_date || 'No date'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                    {isActive && (
                                        <>
                                            <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none" />
                                            {/* <div className="absolute left-0 top-0 w-1 h-full bg-blue-500" /> */}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewQueue;