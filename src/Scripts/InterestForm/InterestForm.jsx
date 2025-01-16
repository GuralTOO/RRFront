import React, { useState } from 'react';
import { Mail, User, MessageSquare, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/supabaseClient';
const InputWithIcon = ({ icon: Icon, ...props }) => (
    <div className="relative mb-6">
        <Input
            className="pl-10 bg-white border-gray-200 transition-all duration-300 focus:ring-0 focus:border-gray-300"
            {...props}
        />
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
);

const BackButton = ({ onClick }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className="absolute top-4 left-4 p-2 text-blue-600 hover:text-blue-800 transition-all duration-200"
    >
        <ArrowLeft className="mr-2" size={20} />
        Back
    </Button>
);

const saveOrUpdateInterest = async (name, email, context) => {
    // First, check if an entry with this email already exists
    const { data: existingEntries, error: fetchError } = await supabase
        .from('interest_list')
        .select()
        .eq('email', email);

    if (fetchError) throw fetchError;

    if (existingEntries && existingEntries.length > 0) {
        // Update existing entry
        const { data, error } = await supabase
            .from('interest_list')
            .update({ name, context })
            .eq('email', email);

        if (error) throw error;
        return { data, isUpdate: true };
    } else {
        // Insert new entry
        const { data, error } = await supabase
            .from('interest_list')
            .insert([{ name, email, context }]);

        if (error) throw error;
        return { data, isUpdate: false };
    }
};

export default function InterestForm() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [context, setContext] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { isUpdate } = await saveOrUpdateInterest(name, email, context);
            setIsUpdate(isUpdate);
            setSubmitted(true);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-gradient-to-b from-gray-50 to-white p-10 rounded-xl shadow-lg"
                >
                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                        <AlertDescription>
                            {isUpdate
                                ? "Thank you for your continued interest! Your information has been updated."
                                : "Thank you for your interest in RapidReview! We've recorded your information."}
                            {" We'll follow up based on our availability."}
                        </AlertDescription>
                    </Alert>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-blue-600 to-black text-white transition-all duration-200 hover:from-blue-700 hover:to-gray-900"
                    >
                        Return to Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-gradient-to-b from-gray-50 to-white p-10 rounded-xl shadow-lg relative"
            >
                <BackButton onClick={() => navigate('/')} />
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-block bg-gradient-to-r from-blue-600 to-black rounded-full p-3 mb-4"
                    >
                        <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Join the Research Revolution
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        RapidReview is accelerating systematic reviews. Be among the first to experience it!
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-6">
                            <Label htmlFor="name" className="text-gray-700 mb-2 block">Your Name</Label>
                            <InputWithIcon
                                icon={User}
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="email" className="text-gray-700 mb-2 block">Email Address</Label>
                            <InputWithIcon
                                icon={Mail}
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="context" className="text-gray-700 mb-2 block">Your Context and Interest</Label>
                            <div className="relative">
                                <Textarea
                                    id="context"
                                    name="context"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Tell us about your role, organization, and why you're interested in RapidReview"
                                    className="pl-10 pt-2 min-h-[100px] bg-white border-gray-200 transition-all duration-300 focus:ring-0 focus:border-gray-300"
                                />
                                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-black text-white transition-all duration-200 hover:from-blue-700 hover:to-gray-900 transform hover:scale-105"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Join the Waitlist'}
                        </Button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                    We prioritize early access based on use case and potential impact.
                </p>
            </motion.div>
        </div>
    );
}