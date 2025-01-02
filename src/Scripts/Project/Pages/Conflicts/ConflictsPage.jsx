import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertOctagon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import PageHeader from '../../components/PageHeader';
import StageCard from './components/StageCard';
import StageCardExpanded from './components/StageCardExpanded';

import { 
    getConflictsOverview, 
    canResolveConflicts,
    startConflictResolution 
} from '@/api/reviewsAPI';

const ConflictsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const [overview, setOverview] = useState(null);
    const [canResolve, setCanResolve] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedStage, setExpandedStage] = useState(null);

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [overviewData, canResolveStatus] = await Promise.all([
                getConflictsOverview(projectId),
                canResolveConflicts(projectId)
            ]);
            setOverview(overviewData);
            setCanResolve(canResolveStatus);
            setError(null);
        } catch (err) {
            console.error('Error loading conflicts data:', err);
            setError('Failed to load conflicts data');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load conflicts data",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartResolution = async (stageId) => {
        try {
            const result = await startConflictResolution(projectId, stageId);
            if (result.success) {
                navigate(result.nextUrl);
            }
        } catch (err) {
            console.error('Error starting conflict resolution:', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to start conflict resolution session",
            });
        }
    };

    const getStageTitle = (stage) => {
        switch (stage) {
            case 'abstract_screening':
                return 'Abstract Screening';
            case 'full_text_screening':
                return 'Full-text Screening';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col">
                <PageHeader 
                    icon={AlertOctagon}
                    title="Conflicts"
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col">
                <PageHeader 
                    icon={AlertOctagon}
                    title="Conflicts"
                />
                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    const stages = ['abstract_screening', 'full_text_screening'];

    const renderContent = () => {
        if (expandedStage) {
            return (
                <StageCardExpanded
                    stats={overview[expandedStage]}
                    projectId={projectId}
                    stageId={overview[expandedStage].stage_id}
                    onStartResolution={() => handleStartResolution(overview[expandedStage].stage_id)}
                    canResolve={canResolve}
                />
            );
        }

        return (
            <div className="grid md:grid-cols-2 gap-6 max-w-screen-xl mx-auto w-full">
                {stages.map((stage) => (
                    <StageCard
                        key={stage}
                        id={stage}
                        title={getStageTitle(stage)}
                        stats={overview[stage]}
                        onExpand={() => setExpandedStage(stage)}
                        canResolve={canResolve}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <PageHeader 
                icon={AlertOctagon}
                title="Conflicts"
                breadcrumb={expandedStage ? ["Conflicts", getStageTitle(expandedStage)] : undefined}
                onBreadcrumbClick={() => setExpandedStage(null)}
            />

            <div className="flex-1 overflow-hidden">
                {/* {!canResolve && (
                    <div className="px-6 pt-6">
                        <Alert className="mb-6 max-w-screen-xl mx-auto">
                            <AlertDescription>
                                You don't have permission to resolve conflicts. Only senior reviewers and admins can resolve conflicts.
                            </AlertDescription>
                        </Alert>
                    </div>
                )} */}

                {renderContent()}
            </div>
        </div>
    );
};

export default ConflictsPage;
