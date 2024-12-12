import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadCloud } from "lucide-react";
import { uploadPaperPDF } from '@/api/projectsApi';

const PDFUploader = ({ projectId, paperId, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleUpload = async (file) => {
        setUploading(true);
        setUploadError(null);
        try {
            await uploadPaperPDF(projectId, paperId, file);
            onUploadComplete?.();
        } catch (error) {
            setUploadError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50/50 rounded-lg">
            <div className="text-center space-y-4">
                <UploadCloud className="mx-auto h-16 w-16 text-gray-400" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900">No PDF Available</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload a PDF file to view the full text</p>
                </div>

                {uploadError && (
                    <Alert variant="destructive" className="max-w-md mt-4">
                        <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                )}

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                    }}
                    className="hidden"
                    id="pdf-upload"
                />

                <Button
                    onClick={() => document.getElementById('pdf-upload').click()}
                    disabled={uploading}
                    variant="outline"
                    className="relative mt-4"
                >
                    {uploading ? (
                        <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload PDF
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PDFUploader;