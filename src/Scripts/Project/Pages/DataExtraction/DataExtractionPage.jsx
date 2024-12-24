// src/Scripts/Project/pages/DataExtraction/DataExtractionPage.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DataExtractionPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Data Extraction</h1>
      <Card>
        <CardHeader>
          <CardTitle>Data Extraction Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Data extraction functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExtractionPage;