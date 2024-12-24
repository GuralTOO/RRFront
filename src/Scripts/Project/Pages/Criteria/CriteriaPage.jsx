// src/Scripts/Project/pages/Criteria/CriteriaPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CriteriaTab from '../../../Experiment/pages/Project/CriteriaTab';

const CriteriaPage = () => {
  const { projectId } = useParams();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Selection Criteria</h1>
      <CriteriaTab projectId={projectId} />
    </div>
  );
};

export default CriteriaPage;