import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { uploadCsvFile } from '@/api/papersApi';

const CsvUploadModal = ({ projectId, onUploadComplete }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setResult(null); // Clear any previous results
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setResult(null);

        try {
            const response = await uploadCsvFile(file, projectId);
            setResult(`Upload successful. `);
            onUploadComplete();
        } catch (error) {
            setResult(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const resetModal = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) resetModal();
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-sm py-1.5 px-3 h-9"
                >
                    Upload CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload CSV</CardTitle>
                        <CardDescription>Upload a CSV file to add multiple papers at once.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="csvFile">Select CSV File</Label>
                                <Input
                                    id="csvFile"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {file && (
                                <p className="text-sm">Selected file: {file.name}</p>
                            )}
                            {result && (
                                <p className="text-sm font-medium">{result}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                        // disabled={true}
                        >
                            {uploading ? 'Uploading...' : 'Upload CSV'}
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default CsvUploadModal;