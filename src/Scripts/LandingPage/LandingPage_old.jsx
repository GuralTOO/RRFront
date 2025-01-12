// import React from 'react';
// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { 
//   BookOpen, Users, Brain, ArrowRight, Search, 
//   Sparkles, Zap, ChartBar, Clock, CheckCircle, 
//   Globe, FileText, BarChart 
// } from 'lucide-react';

// const FeatureCard = ({ icon: Icon, title, description }) => (
//   <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//     <CardContent className="p-6">
//       <div className="flex items-center mb-4">
//         {React.cloneElement(Icon, { className: "w-6 h-6 text-blue-600" })}
//         <h3 className="text-xl font-semibold ml-3">{title}</h3>
//       </div>
//       <p className="text-gray-600">{description}</p>
//     </CardContent>
//   </Card>
// );

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Navigation */}
//       <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Zap className="w-8 h-8 text-blue-600" />
//             <span className="text-2xl font-bold text-gray-900 ml-2">RapidReview</span>
//           </div>
//           <Button 
//             variant="outline" 
//             className="border-blue-600 text-blue-600 hover:bg-blue-50"
//             onClick={() => window.location.href = '/login'}
//           >
//             Get Early Access
//           </Button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center max-w-4xl mx-auto"
//           >
//             <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black">
//               Transform Your Literature Reviews
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Leverage AI-powered insights and robust collaboration tools to conduct 
//               systematic reviews with unprecedented efficiency and precision.
//             </p>
//             <div className="flex justify-center items-center gap-4">
//               <Button 
//                 size="lg"
//                 className="bg-blue-600 hover:bg-blue-700"
//                 onClick={() => window.location.href = '/login'}
//               >
//                 Start Your Review <ArrowRight className="ml-2 w-4 h-4" />
//               </Button>
//               <span className="text-sm text-gray-500 flex items-center">
//                 <Sparkles className="w-4 h-4 mr-1" /> 
//                 Partnered with Weill Cornell
//               </span>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Comprehensive Review Management
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <FeatureCard
//               icon={<Brain />}
//               title="AI-Powered Screening"
//               description="Smart relevance scoring and automated criteria matching accelerate the screening process while maintaining methodological rigor."
//             />
//             <FeatureCard
//               icon={<Users />}
//               title="Seamless Collaboration"
//               description="Built-in consensus tracking, conflict resolution, and team management tools streamline the review process."
//             />
//             <FeatureCard
//               icon={<FileText />}
//               title="Intelligent PDF Analysis"
//               description="Advanced text analysis automatically highlights relevant content based on your inclusion and exclusion criteria."
//             />
//           </div>
//         </div>
//       </section>

//       {/* Search Engine Preview */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="bg-gradient-to-r from-blue-600 to-black rounded-2xl p-12 text-white">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="text-3xl font-bold mb-6">
//                 Introducing Smart Search
//               </h2>
//               <p className="text-xl mb-8">
//                 Experience our upcoming proprietary search engine, powered by 
//                 RapidReview's advanced relevance scoring system. Find the most 
//                 relevant papers faster than ever before.
//               </p>
//               <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 relative overflow-hidden">
//                 <Search className="w-8 h-8 mb-4" />
//                 <div className="space-y-2">
//                   <div className="h-2 bg-white/20 rounded w-3/4 mx-auto" />
//                   <div className="h-2 bg-white/20 rounded w-1/2 mx-auto" />
//                 </div>
//                 <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Process Steps */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Streamlined Review Process
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: <FileText />,
//                 title: "Import",
//                 description: "Easy import from major reference managers and databases"
//               },
//               {
//                 icon: <Brain />,
//                 title: "Screen",
//                 description: "AI-assisted abstract and full-text screening"
//               },
//               {
//                 icon: <Users />,
//                 title: "Collaborate",
//                 description: "Built-in consensus tracking and conflict resolution"
//               },
//               {
//                 icon: <BarChart />,
//                 title: "Export",
//                 description: "Comprehensive exports with full decision tracking"
//               }
//             ].map((step, index) => (
//               <div key={index} className="text-center">
//                 <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                   {React.cloneElement(step.icon, { className: "w-8 h-8 text-blue-600" })}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                 <p className="text-gray-600">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold mb-6">
//             Ready to Transform Your Review Process?
//           </h2>
//           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//             Join leading researchers and organizations in experiencing the future 
//             of systematic reviews.
//           </p>
//           <Button 
//             size="lg" 
//             className="bg-blue-600 hover:bg-blue-700"
//             onClick={() => window.location.href = '/login'}
//           >
//             Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
//           </Button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center mb-6 md:mb-0">
//               <Zap className="w-6 h-6 text-blue-400" />
//               <span className="text-xl font-bold ml-2">RapidReview</span>
//             </div>
//             <div className="flex flex-wrap justify-center gap-8">
//               <a href="#" className="hover:text-blue-400 transition-colors">About</a>
//               <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
//               <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
//               <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
//             </div>
//           </div>
//           <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
//             © {new Date().getFullYear()} RapidReview. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, Zap, Brain, Users, FileText, 
  ChevronDown, ChevronUp, BarChart, Check
} from 'lucide-react';
import FeaturesSection from './FeaturesSection';  // You'll need to create this file


const DemoSection = () => (
  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
    {/* Video placeholder - we'll replace this with actual video embed */}
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-gray-500">Demo Video Placeholder</p>
    </div>
  </div>
);

const ScreenshotDisplay = ({ title, description }) => (
  <div className="bg-gray-100 rounded-lg p-4 aspect-[4/3]">
    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
      <p className="text-gray-500">{title} Screenshot</p>
    </div>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </div>
);

const WorkflowStage = ({ title, description, metrics, screenshot }) => (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white">
          <h3 className="text-2xl font-semibold mb-4 text-blue-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
          {metrics && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-blue-600">{metrics.value}</span>
                <span className="ml-2 text-blue-800 font-medium">{metrics.label}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-lg">
          <img 
            src="/api/placeholder/600/400"
            alt={screenshot.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="absolute -bottom-4 left-8 right-8 bg-white p-4 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{screenshot.description}</p>
        </div>
      </div>
    </div>
  );
  

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Nav remains the same */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 ml-2">RapidReview</span>
          </div>
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = '/login'}
          >
            Request Access
          </Button>
        </div>
      </nav>

    <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
                Systematic Reviews, Streamlined
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Complete your literature review in a fraction of the time with 
                AI-powered insights and robust project management
              </p>
            </motion.div>
            
            <div className="relative">
              <DemoSection />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Button 
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  onClick={() => window.location.href = '/login'}
                >
                  Watch Demo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />



      {/* Workflow Stages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Accelerated Workflow
          </h2>
          <Tabs defaultValue="abstract" className="space-y-12">
            <TabsList className="justify-center">
              <TabsTrigger value="abstract">Abstract Screening</TabsTrigger>
              <TabsTrigger value="fulltext">Full-Text Review</TabsTrigger>
              <TabsTrigger value="extraction">Data Extraction</TabsTrigger>
            </TabsList>
            <TabsContent value="abstract">
              <WorkflowStage
                title="Smart Abstract Screening"
                description="Our proprietary RR Score predicts paper relevance with unprecedented accuracy, helping you focus on what matters."
                metrics={{ value: "92%", label: "Accuracy in relevance prediction" }}
                screenshot={{
                  title: "Abstract Screening Interface",
                  description: "Shows RR Score and quick review interface"
                }}
              />
            </TabsContent>
            <TabsContent value="fulltext">
              <WorkflowStage
                title="Intelligent Full-Text Review"
                description="Automatically highlights text matching your inclusion/exclusion criteria, dramatically reducing review time."
                screenshot={{
                  title: "Full-Text Review Interface",
                  description: "Shows PDF viewer with highlighted matching criteria"
                }}
              />
            </TabsContent>
            <TabsContent value="extraction">
              <WorkflowStage
                title="Data Extraction"
                description="Coming soon: Automated data extraction from full-text papers."
                screenshot={{
                  title: "Data Extraction Interface",
                  description: "Preview of upcoming data extraction features"
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-black">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Review Process?
          </h2>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => window.location.href = '/login'}
          >
            Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* //       Footer */}
         <footer className="bg-gray-900 text-white py-12">
         <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="flex items-center mb-6 md:mb-0">
               <Zap className="w-6 h-6 text-blue-400" />
               <span className="text-xl font-bold ml-2">RapidReview</span>
             </div>
             <div className="flex flex-wrap justify-center gap-8">
               <a href="#" className="hover:text-blue-400 transition-colors">About</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
             </div>
           </div>
           <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
             © {new Date().getFullYear()} RapidReview. All rights reserved.
           </div>
         </div>
       </footer>
    </div>
  );
};

export default LandingPage;