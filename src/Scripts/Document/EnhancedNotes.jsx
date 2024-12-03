import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Check } from 'lucide-react';

const EnhancedNotes = ({ 
    notes, 
    onNotesChange 
}) => {
    const [isSaving, setIsSaving] = useState(false);
    
    const handleKeyCommand = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const currentPos = e.target.selectionStart;
            const textBefore = notes.substring(0, currentPos);
            const textAfter = notes.substring(currentPos);
            onNotesChange(`${textBefore}[pg. X] ${textAfter}`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <div className={`
                        transition-opacity duration-200 ease-in-out flex items-center gap-1
                        text-xs text-gray-400
                        ${isSaving ? 'opacity-100' : 'opacity-0'}
                    `}>
                        <Check className="w-3 h-3" />
                        <span>Saving...</span>
                    </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-gray-500">⌘</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-gray-500">↵</kbd>
                    <span className="ml-1">insert page reference</span>
                </div>
            </div>

            {/* Notes Area */}
            <Textarea
                value={notes}
                onChange={(e) => {
                    onNotesChange(e.target.value);
                    setIsSaving(true);
                    setTimeout(() => setIsSaving(false), 1500);
                }}
                onKeyDown={handleKeyCommand}
                placeholder="Start taking notes..."
                className="flex-1 w-full p-4 resize-none bg-gray-50/50 placeholder:text-gray-400
                    border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                    rounded-none h-full"
            />
        </div>
    );
};

export default EnhancedNotes;