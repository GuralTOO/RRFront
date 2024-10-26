import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarOutlined, UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const PaperReviewCard = ({
    paper,
    projectDetails,
    actions,
    loading = false,
    showRelevancyScore = true,
    additionalContent = null
}) => {
    const getButtonStyles = (variant) => {
        switch (variant) {
            case 'destructive':
                return 'bg-red-500 hover:bg-red-600 text-white';
            case 'success':
                return 'bg-green-500 hover:bg-green-600 text-white';
            case 'secondary':
                return 'bg-gray-500 hover:bg-gray-600 text-white';
            default:
                return '';
        }
    };

    const renderActions = () => {
        return actions.map((action, index) => (
            <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={loading}
                className={`w-full sm:w-auto ${getButtonStyles(action.variant)} ${action.className || ''}`}
            >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
            </Button>
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[860px] mx-auto px-5 sm:px-6">
            <Card className="mb-5 overflow-hidden">
                <div className="p-6">
                    {/* Project Header */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-2xl font-bold">{projectDetails.name}</h3>
                        <div className="flex items-center gap-2">
                            <QuestionCircleOutlined className="h-5 w-5" />
                            <span className="font-semibold">Research Question:</span>
                        </div>
                        <p className="text-gray-700">{projectDetails.researchQuestion}</p>
                    </div>

                    {/* Paper Content */}
                    <div className="space-y-4 w-full">
                        <h4 className="text-xl font-semibold">{paper.title}</h4>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <UserOutlined className="h-4 w-4" />
                                <span>{paper.authors}</span>
                            </div>
                            <div className="h-3 w-px bg-gray-300 mx-2" />
                            <div className="flex items-center gap-1">
                                <CalendarOutlined className="h-4 w-4" />
                                <span>{paper.publication_date}</span>
                            </div>
                        </div>

                        {showRelevancyScore && (
                            <div className="w-full">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${paper.relevancy_score * 10}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Relevance: {paper.relevancy_score}
                                </p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 my-4" />

                        <div>
                            <h5 className="font-semibold mb-2">Abstract:</h5>
                            <p className="text-gray-700">{paper.abstract}</p>
                        </div>

                        {additionalContent && (
                            <div className="mt-4">
                                {additionalContent}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 -mx-6 -mb-6 mt-6 p-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            {renderActions()}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PaperReviewCard;

// Example Layout Component
const PaperReviewLayout = ({ children, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600">Loading project details and papers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[860px] mx-auto px-5 sm:px-6 py-5">
            {children}
        </div>
    );
};

export { PaperReviewLayout };