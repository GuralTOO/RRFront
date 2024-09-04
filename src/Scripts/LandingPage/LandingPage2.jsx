import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Brain, ArrowRight, Database, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-3">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </CardContent>
    </Card>
);

const LandingPage2 = () => {
    return (
        <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.h1
                    className="text-5xl font-bold mb-6 text-gray-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Revolutionize Your Literature Reviews
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-600 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Streamline your research with our collaborative platform powered by ML insights
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Sign Up Now <ArrowRight className="ml-2" />
                    </Button>
                </motion.div>
            </section>

            {/* Key Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BookOpen className="w-8 h-8 text-blue-600" />}
                        title="Comprehensive Reviews"
                        description="Manage systematic literature reviews from abstract screening to data extraction."
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8 text-blue-600" />}
                        title="Collaborative Platform"
                        description="Work seamlessly with your research team on projects containing thousands of papers."
                    />
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-blue-600" />}
                        title="ML-Powered Insights"
                        description="Leverage our in-house ML models to predict paper relevance based on your research questions."
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
                <h2 className="text-3xl font-semibold text-center mb-12">ML-Powered Insights</h2>
                <div className="bg-blue-100 rounded-lg p-8 flex items-center justify-between">
                    <div className="max-w-2xl">
                        <h3 className="text-2xl font-semibold mb-4">Intelligent Paper Relevance Prediction</h3>
                        <p className="text-gray-700 mb-6">Our advanced machine learning models analyze your research questions and keywords to predict paper relevance, saving you valuable time in the screening process.</p>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                            Learn More
                        </Button>
                    </div>
                    <Sparkles className="w-32 h-32 text-blue-600" />
                </div>
            </section>

            {/* Future Roadmap */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center mb-12">Future Roadmap</h2>
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Database className="w-6 h-6 mr-2 text-blue-600" />
                                    Enhanced Data Extraction
                                </h3>
                                <p className="text-gray-600">We're working on advanced features to support systematic reviews by automating data extraction from full-text papers, further streamlining your research process.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Placeholder */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-center mb-12">What Researchers Say</h2>
                <p className="text-center text-gray-600">Testimonials coming soon as we gather feedback from our alpha users.</p>
            </section>

            {/* Call-to-Action */}
            <section className="bg-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Research Process?</h2>
                    <p className="text-xl mb-8">Join our platform and experience the future of collaborative literature reviews.</p>
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                        Sign Up for Early Access
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage2;