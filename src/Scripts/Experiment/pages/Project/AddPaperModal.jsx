import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from 'antd';
import { CalendarIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const AddPaperModal = ({ onAddPaper }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [authors, setAuthors] = useState(['']);
    const [publicationDate, setPublicationDate] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddPaper({
            title,
            abstract,
            authors: authors.filter(author => author.trim() !== ''),
            publicationDate: publicationDate ? publicationDate.toDate() : null
        });
        resetForm();
        setOpen(false);
    };

    const resetForm = () => {
        setTitle('');
        setAbstract('');
        setAuthors(['']);
        setPublicationDate(null);
    };

    const handleAuthorChange = (index, value) => {
        const newAuthors = [...authors];
        newAuthors[index] = value;
        setAuthors(newAuthors);
    };

    const addAuthorField = () => {
        setAuthors([...authors, '']);
    };

    const handleDateChange = (date) => {
        setPublicationDate(date);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="text-sm py-1.5 px-3 h-9" // Adjusted size and padding
                >
                    Add New Paper
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Paper</CardTitle>
                        <CardDescription>Enter the details of the paper you want to add to the project.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="abstract">Abstract</Label>
                                    <Textarea
                                        id="abstract"
                                        value={abstract}
                                        onChange={(e) => setAbstract(e.target.value)}
                                    />
                                </div>
                                {authors.map((author, index) => (
                                    <div key={index} className="flex flex-col space-y-1.5">
                                        <Label htmlFor={`author-${index}`}>
                                            {index === 0 ? 'Author' : `Author ${index + 1}`}
                                        </Label>
                                        <Input
                                            id={`author-${index}`}
                                            value={author}
                                            onChange={(e) => handleAuthorChange(index, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <Button type="button" onClick={addAuthorField} variant="outline">
                                    Add Another Author
                                </Button>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="publicationDate">Publication Date</Label>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        value={publicationDate}
                                        onChange={handleDateChange}
                                        format="MMMM D, YYYY"
                                        inputReadOnly
                                        suffixIcon={<CalendarIcon className="h-4 w-4" />}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Add the paper</Button>
                        </CardFooter>
                    </form>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default AddPaperModal;