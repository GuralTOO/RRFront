import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadImportFile } from '@/api/papersApi';

const FileUploadModal = ({ projectId, onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const fileTypes = [
    { id: "nbib", name: "PubMed NBIB", extension: ".nbib", mimeType: "application/octet-stream" },
    { id: "covidence", name: "Covidence CSV", extension: ".csv", mimeType: "text/csv" },
    // { id: "endnote", name: "EndNote", extension: ".enw", mimeType: "application/x-endnote-refer" },
    // { id: "ris", name: "RIS", extension: ".ris", mimeType: "application/x-research-info-systems" }
  ];

  const handleFileTypeChange = (newFileType) => {
    setFileType(newFileType);
    setFile(null); // Clear the selected file when file type changes
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const selectedFileType = fileTypes.find(type => type.id === fileType);
      
      // Check if the file extension matches the selected type
      if (!selectedFile.name.toLowerCase().endsWith(selectedFileType.extension)) {
        setError(`Please select a valid ${selectedFileType.extension} file`);
        event.target.value = ''; // Reset the file input
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const validateFile = () => {
    if (!file || !fileType) {
      setError("Please select both a file and file type");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateFile()) return;

    setUploading(true);
    setUploadProgress(0);
    setResult(null);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await uploadImportFile(file, projectId, fileType);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setResult("Upload successful!");
      onUploadComplete();
      
      // Close modal after success
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      setError(error.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setFileType("");
    setResult(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileTypeAccept = () => {
    if (!fileType) return '';
    const selectedType = fileTypes.find(type => type.id === fileType);
    return `${selectedType.mimeType}, ${selectedType.extension}`;
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm py-1.5 px-3 h-9">
          <Upload className="h-3 w-5" />
          Import Papers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileType className="h-5 w-5" />
              Import Papers
            </CardTitle>
            <CardDescription>
              Select your reference file type and upload to import multiple papers at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File Type</label>
              <Select value={fileType} onValueChange={handleFileTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.extension})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload File</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept={getFileTypeAccept()}
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={!fileType}
              />
              {!fileType && (
                <p className="text-sm text-gray-500">
                  Please select a file type first
                </p>
              )}
              {file && (
                <p className="text-sm text-gray-500">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-500 text-center">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{result}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || !fileType || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;