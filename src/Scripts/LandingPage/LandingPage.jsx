import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap,
  ArrowRight,
} from 'lucide-react';
import SystematicReviewFlow from './components/SystematicReviewFlow';

// Import theme components
import { useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

// Import feature grid
import {FeatureGrid} from './components/FeatureGrid';

const WorkflowStage = ({ title, description, metrics, screenshot, index }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="grid lg:grid-cols-2 gap-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="space-y-6">
        <div className={`p-8 rounded-2xl ${
          theme === 'dark' 
            ? 'bg-neutral-900 border-neutral-800' 
            : 'bg-white border-gray-200'
        } border`}>
          <h3 className={`text-2xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{title}</h3>
          <p className={
            theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
          }>{description}</p>
          {metrics && (
            <div className={`mt-6 p-6 rounded-xl border ${
              theme === 'dark'
                ? 'bg-neutral-800/50 border-neutral-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>{metrics.value}</span>
                <span className="ml-2 text-blue-600 font-medium">{metrics.label}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className={`aspect-video rounded-2xl p-8 border ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`w-full h-full rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'
          }`}>
            <span className={
              theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'
            }>Screenshot Preview</span>
          </div>
        </div>
        <div className={`absolute -bottom-4 left-8 right-8 p-4 rounded-lg border backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-neutral-900/90 border-neutral-800'
            : 'bg-white/90 border-gray-200'
        }`}>
          <p className={
            theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
          }>{screenshot.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 border-b backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-black/50 border-neutral-800'
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className={
              theme === 'dark' ? 'text-blue-400 w-8 h-8' : 'text-blue-600 w-8 h-8'
            } />
            <span className={`text-2xl font-bold ml-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              RapidReview
              <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                theme === 'dark' 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                  : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                BETA
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button
              variant="outline"
              className={`${
                theme === 'dark'
                  ? 'border-neutral-700 text-white hover:bg-neutral-800'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] ${
          theme === 'dark'
            ? 'from-blue-500/10 via-transparent to-transparent'
            : 'from-blue-500/5 via-transparent to-transparent'
        }`} />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.h1 
              className={`text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Systematic Reviews
              <span className={`block mt-2 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>Done in a week</span>
            </motion.h1>
            <p className={`text-xl mb-8 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
            }`}>
              RapidReview is an AI accelerated systematic review platform.
              Follow the rules and requirements of systematic reviews with the help of validated AI algorithms for screening
              and instant data extraction.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                className={
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              >
                Start your project
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className={
                  theme === 'dark'
                    ? 'border-neutral-700 text-white hover:bg-neutral-800'
                    : 'border-gray-300 text-gray-900 hover:bg-gray-100'
                }
              >
                Request a demo
              </Button>
              
            </div>
            {/* <p className={`text-sm ${
  theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
}`}>
  RapidReview is currently in beta
</p> */}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            {/* <ReviewPipelineAnimation /> */}
            <SystematicReviewFlow />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <FeatureGrid />

      {/* Workflow Section */}
      <section className={`py-20 border-t ${
        theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
      }`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Accelerated Workflow
          </h2>
          <Tabs defaultValue="abstract" className="space-y-12">
            <TabsList className={`justify-center p-1 rounded-lg ${
              theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-100'
            }`}>
              <TabsTrigger 
                value="abstract"
                className={
                  theme === 'dark'
                    ? 'data-[state=active]:bg-neutral-800'
                    : 'data-[state=active]:bg-white'
                }
              >
                Abstract Screening
              </TabsTrigger>
              <TabsTrigger 
                value="fulltext"
                className={
                  theme === 'dark'
                    ? 'data-[state=active]:bg-neutral-800'
                    : 'data-[state=active]:bg-white'
                }
              >
                Full-Text Review
              </TabsTrigger>
              <TabsTrigger 
                value="extraction"
                className={
                  theme === 'dark'
                    ? 'data-[state=active]:bg-neutral-800'
                    : 'data-[state=active]:bg-white'
                }
              >
                Data Extraction
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="abstract">
              <WorkflowStage
                index={0}
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
                index={1}
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
                index={2}
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Review Process?
          </h2>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Zap className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-xl font-bold ml-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>RapidReview</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {['About', 'Contact', 'Terms', 'Privacy'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t text-center ${
            theme === 'dark'
              ? 'border-neutral-800 text-neutral-400'
              : 'border-gray-200 text-gray-600'
          }`}>
            © {new Date().getFullYear()} RapidReview. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;