import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Brain, ArrowRight, Database, Sparkles, Zap, ChartBar, Clock, Search, Beaker } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <CardContent className="p-6">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-3">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </CardContent>
    </Card>
);

const LandingPage5 = () => {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center">

                    <Zap className="w-8 h-8 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">RapidReview</span>
                </div>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = '/login'}>
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
                    Accelerate Your<br />Literature Reviews
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Experience efficient, AI-powered collaborative research with our innovative platform
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center items-center space-x-4"
                >
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = '/login'}>
                        Get Started <ArrowRight className="ml-2" />
                    </Button>
                    <span className="text-sm text-gray-500 flex items-center">
                        <ChartBar className="w-4 h-4 mr-1" /> Alpha Version
                    </span>
                </motion.div>
            </section>

            {/* Key Benefits */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-blue-600 to-black rounded-lg p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4 flex items-center">
                        <Beaker className="w-8 h-8 mr-3" /> Cutting-Edge Technology
                    </h2>
                    <p className="text-lg mb-6">
                        We're at the forefront of research innovation, combining advanced ML algorithms with collaborative tools to improve the way literature reviews are conducted.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>State-of-the-art ML models for paper relevance prediction</li>
                        <li>Experimental features in continuous development</li>
                        <li>Pioneering approach to data extraction and analysis</li>
                    </ul>
                </div>
            </section>

            {/* Platform Capabilities */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">Platform Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BookOpen className="w-8 h-8 text-blue-600" />}
                        title="Comprehensive Reviews"
                        description="Manage systematic literature reviews from abstract screening to data extraction with intelligent tools."
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8 text-blue-600" />}
                        title="Collaborative Platform"
                        description="Work seamlessly with your research team on projects containing thousands of papers, enhancing productivity."
                    />
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-blue-600" />}
                        title="AI-Powered Insights"
                        description="Utilize our advanced ML models to predict paper relevance and uncover patterns in your research data."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12">How RapidReview Works</h2>
                    {/* Add a step-by-step guide or infographic here */}
                </div>
            </section>

            {/* AI Capabilities */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">AI-Powered Efficiency</h2>
                <div className="bg-gradient-to-r from-blue-100 to-gray-200 rounded-lg p-8 flex items-center justify-between">
                    <div className="max-w-2xl">
                        <h3 className="text-2xl font-semibold mb-4">Intelligent Paper Relevance Prediction</h3>
                        <p className="text-gray-700 mb-6">Our machine learning models analyze your research questions and keywords to predict paper relevance with over 90% accuracy, significantly speeding up the screening process.</p>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                            Learn About Our AI
                        </Button>
                    </div>
                    <Sparkles className="w-32 h-32 text-blue-600" />
                </div>
            </section>

            {/* Future Innovations */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12">Future Innovations</h2>
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-gray-50 shadow-lg border border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Database className="w-6 h-6 mr-2 text-blue-600" />
                                    Advanced Data Extraction
                                </h3>
                                <p className="text-gray-600">We're developing new features to support systematic reviews by automating data extraction from full-text papers, aiming to further enhance research efficiency.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call-to-Action */}
            <section className="bg-gradient-to-r from-blue-600 to-black text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Accelerate Your Research?</h2>
                    <p className="text-xl mb-8">Join RapidReview and experience the future of efficient literature reviews.</p>
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => window.location.href = '/login'}>
                        Start Your Free Trial
                    </Button>
                </div>
            </section>

            <footer className="bg-gray-100 py-8 mt-auto">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <div className="flex items-center">
                                <Zap className="w-6 h-6 text-blue-600 mr-2" />
                                <span className="text-xl font-bold text-gray-900">RapidReview</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Accelerating Research</p>
                        </div>
                        <div className="w-full md:w-2/3 flex flex-wrap justify-end">
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mr-6 mb-2">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mr-6 mb-2">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mr-6 mb-2">Cookie Policy</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mb-2">Contact Us</a>
                        </div>
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-8">
                        © {new Date().getFullYear()} RapidReview. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage5;

/*
            <motion.h1 
              className="text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Systematic Reviews
              <span className="block text-blue-400 mt-2">Done in a week</span>
            </motion.h1>
            <p className="text-xl text-neutral-400 mb-8">
              RapidReview is an AI accelerated systematic review platform.
              Follow the rules and requirements of systematic reviews with the help of validated AI algorithms for screening
              and instant data extraction.
            </p>
            */