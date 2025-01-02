import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const ConflictsHistory = ({ conflicts, loading }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper</TableHead>
            <TableHead>Resolution</TableHead>
            <TableHead>Resolved By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conflicts.map((conflict) => (
            <TableRow key={conflict.conflict_id}>
              <TableCell>
                <div>
                  <div className="font-medium">{conflict.paper_title}</div>
                  <div className="text-sm text-gray-500">
                    {conflict.paper_authors.join(', ')}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={conflict.resolution === 'accept' ? 'success' : 'destructive'}>
                    {conflict.resolution.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {conflict.resolution_reason}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {conflict.resolver.username}
              </TableCell>
              <TableCell>
                {formatDate(conflict.resolution_date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default ConflictsHistory;