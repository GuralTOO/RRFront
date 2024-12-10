// Chat/ChatInput.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";
import { sendMessage } from '@/api/chat';

const ChatInput = ({ channelId, parentMessageId = null }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            setSending(true);
            
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Send message
            await sendMessage(channelId, user.id, message.trim(), parentMessageId);
            
            // Clear input on success
            setMessage('');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    disabled={sending || !message.trim()}
                >
                    <Send size={18} />
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;