import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailInput = ({ value, onChange }) => (
    <div className="relative">
        <input
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Your email"
            value={value}
            required
            onChange={onChange}
        />
        <Mail className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);

const AuthButton = ({ loading, children, ...props }) => (
    <button
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        disabled={loading}
        {...props}
    >
        {loading ? 'Loading...' : children}
    </button>
);

const BackButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
    >
        <ArrowLeft className="mr-2" size={20} />
    </button>
);

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                navigate('/dashboard');
            }
        });

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [navigate]);

    const handleEmailLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        let redirectTo = window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo
            }
        });

        if (error) {
            alert(error.error_description || error.message);
            console.error(error);
        } else {
            alert('Check your email for the login link!');
            console.log("Redirect URL set to:", redirectTo);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <BackButton onClick={() => navigate('/')} />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <AuthButton loading={loading}>
                            Sign in with Email
                        </AuthButton>
                    </div>
                </form>
            </div>
        </div>
    );
}