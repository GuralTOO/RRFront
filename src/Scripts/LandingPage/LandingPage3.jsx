import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Brain, ArrowRight, Database, Sparkles, Beaker, Zap } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100">
        <CardContent className="p-6">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-3">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </CardContent>
    </Card>
);

const LandingPage3 = () => {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center">
                    <Beaker className="w-8 h-8 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">ResearchLab</span>
                </div>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Sign In
                </Button>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.h1
                    className="text-6xl font-bold mb-6 text-gray-900 leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Revolutionize Your<br />Literature Reviews
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Experience the future of collaborative research with our cutting-edge ML-powered platform
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center items-center space-x-4"
                >
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Sign Up for Early Access <ArrowRight className="ml-2" />
                    </Button>
                    <span className="text-sm text-gray-500 flex items-center">
                        <Zap className="w-4 h-4 mr-1" /> Alpha Version
                    </span>
                </motion.div>
            </section>

            {/* Experimental Nature Highlight */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4 flex items-center">
                        <Beaker className="w-8 h-8 mr-3" /> Cutting-Edge Technology
                    </h2>
                    <p className="text-lg mb-6">
                        We're at the forefront of research innovation, combining advanced ML algorithms with collaborative tools to transform the way literature reviews are conducted.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>State-of-the-art ML models for paper relevance prediction</li>
                        <li>Experimental features in continuous development</li>
                        <li>Pioneering approach to data extraction and analysis</li>
                    </ul>
                </div>
            </section>

            {/* Key Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">Groundbreaking Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BookOpen className="w-8 h-8 text-blue-600" />}
                        title="Comprehensive Reviews"
                        description="Manage systematic literature reviews from abstract screening to data extraction with cutting-edge tools."
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8 text-blue-600" />}
                        title="Collaborative Platform"
                        description="Work seamlessly with your research team on projects containing thousands of papers, powered by real-time collaboration features."
                    />
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-blue-600" />}
                        title="AI-Powered Insights"
                        description="Leverage our advanced ML models to predict paper relevance and uncover hidden patterns in your research data."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
                    {/* Add a step-by-step guide or infographic here */}
                </div>
            </section>

            {/* ML-Powered Insights */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">AI-Powered Insights</h2>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 flex items-center justify-between">
                    <div className="max-w-2xl">
                        <h3 className="text-2xl font-semibold mb-4">Intelligent Paper Relevance Prediction</h3>
                        <p className="text-gray-700 mb-6">Our state-of-the-art machine learning models analyze your research questions and keywords to predict paper relevance, revolutionizing the screening process.</p>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                            Explore AI Features
                        </Button>
                    </div>
                    <Sparkles className="w-32 h-32 text-blue-600" />
                </div>
            </section>

            {/* Future Roadmap */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12">Future Innovations</h2>
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-white shadow-lg border border-blue-100">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Database className="w-6 h-6 mr-2 text-blue-600" />
                                    Enhanced Data Extraction
                                </h3>
                                <p className="text-gray-600">We're developing groundbreaking features to support systematic reviews by automating data extraction from full-text papers, pushing the boundaries of research efficiency.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Placeholder */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">Researcher Feedback</h2>
                <p className="text-center text-gray-600">We're gathering insights from our alpha users. Stay tuned for early adopter experiences!</p>
            </section>

            {/* Call-to-Action */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Pioneer the Future of Research?</h2>
                    <p className="text-xl mb-8">Join our platform and be at the forefront of next-generation literature reviews.</p>
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                        Sign Up for Early Access
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage3;