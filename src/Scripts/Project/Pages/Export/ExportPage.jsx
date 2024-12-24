// src/Scripts/Project/pages/Export/ExportPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";

const ExportPage = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('export-project-papers', {
        body: { project_id: projectId }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from export');

      // Create blob from the CSV data
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${projectId}-export.csv`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your project data has been exported successfully.",
      });
    } catch (err) {
      console.error('Error exporting data:', err);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your project data.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Export Project Data</h1>
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download your project data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Complete Project Export</h3>
            <div className="space-y-2">
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export Project Data'}
              </Button>
              <p className="text-sm text-gray-500">
                Exports all project data including papers, reviews, and analysis in CSV format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;