import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getCriteriaForProject } from '@/api/projectsApi';

const CriteriaSection = ({ title, criteria, type }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg hover:bg-secondary/80">
                <div className="flex items-center space-x-2">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Badge variant={type === 'inclusion' ? 'default' : 'destructive'}>
                        {type === 'inclusion' ? 'Include' : 'Exclude'}
                    </Badge>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
                {criteria.map((categoryObj, index) => {
                    const [category, items] = Object.entries(categoryObj)[0];
                    return (
                        <div key={index} className="ml-6">
                            <h4 className="font-medium text-primary mb-2">{category}</h4>
                            <ul className="space-y-2 ml-4">
                                {items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start space-x-2">
                                        {type === 'inclusion' ? 
                                            <Plus className="h-4 w-4 mt-1 flex-shrink-0 text-green-600" /> :
                                            <Minus className="h-4 w-4 mt-1 flex-shrink-0 text-red-600" />
                                        }
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </CollapsibleContent>
        </Collapsible>
    );
};

const CriteriaTab = ({ projectId }) => {
    const [criteria, setCriteria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                setLoading(true);
                const data = await getCriteriaForProject(projectId);
                setCriteria(data);
            } catch (err) {
                console.error('Error fetching criteria:', err);
                setError('Failed to load criteria data');
            } finally {
                setLoading(false);
            }
        };

        fetchCriteria();
    }, [projectId]);

    if (loading) return <div>Loading criteria...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!criteria) return null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Project Criteria</CardTitle>
                    <CardDescription>
                        Review the inclusion and exclusion criteria for this systematic review
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <CriteriaSection
                        title="Inclusion Criteria"
                        criteria={criteria.inclusion_criteria}
                        type="inclusion"
                    />
                    <CriteriaSection
                        title="Exclusion Criteria"
                        criteria={criteria.exclusion_criteria}
                        type="exclusion"
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CriteriaTab;