import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import GoogleSignInButton from '../GoogleSignInButton';

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
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleEmailLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        let redirectLink = window.location.origin + '/dashboard';
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                redirectTo: redirectLink
            }
        });
        if (error) {
            alert(error.error_description || error.message);
            console.log(error);
        } else {
            alert('Check your email for the login link!');
            console.log("redirecting to url: ", redirectLink);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) {
            alert(error.error_description || error.message);
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome back!
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
                {/* <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <GoogleSignInButton onClick={handleGoogleLogin} />
                        <GoogleButton onClick={handleGoogleLogin} />
                    </div>
                </div> */}
            </div>
        </div>
    );
}