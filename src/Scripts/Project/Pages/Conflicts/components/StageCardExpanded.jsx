import React, { useEffect, useState } from 'react';
import { ArrowUpRightFromCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getConflictHistory } from '@/api/reviewsAPI';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConflictsHistory from './ConflictsHistory';

const StageCardExpanded = ({
  stats,
  projectId,
  stageId,
  onStartResolution,
  canResolve
}) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getConflictHistory(projectId, stageId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Stats Section */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Active Conflicts */}
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">
                {stats.active_conflicts}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Active Conflicts
              </div>
            </div>

            {/* Resolved Conflicts */}
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl font-semibold text-green-600 mb-2">
                {stats.resolved_conflicts}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Resolved Conflicts
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg p-6">
              <div className="text-sm font-medium mb-2">Resolution Progress</div>
              <Progress
                value={(stats.resolved_conflicts / stats.total_conflicts) * 100}
                className="h-2 mb-2"
              />
              <div className="text-sm text-gray-600">
                {Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100)}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-b px-6 py-4">
        <Button
          size="lg"
          className="w-full max-w-md mx-auto"
          disabled={!canResolve || stats.active_conflicts === 0}
          onClick={onStartResolution}
        >
          <ArrowUpRightFromCircle className="h-4 w-4 mr-2" />
          {stats.active_conflicts === 0 ? 'No Active Conflicts' : 'Start Conflict Resolution'}
        </Button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h3 className="text-lg font-medium mb-4">Resolution History</h3>
            <ConflictsHistory
              conflicts={history?.conflicts || []}
              loading={loading}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StageCardExpanded;