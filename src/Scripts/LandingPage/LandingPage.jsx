import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Zap,
  ArrowRight,
} from 'lucide-react';
import SystematicReviewFlow from './components/SystematicReviewFlow';

// Import theme components
import { useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

// Import feature grid
import FeatureGrid from './components/FeatureGrid';


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
              onClick={() => window.location.href = '/login'}
            >
              Login
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
                onClick={() => window.location.href = '/login'}
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
                onClick={() => window.location.href = '/login'}
              >
                Request a demo
              </Button>
              
            </div>

          </div>

          <div className="mt-16 max-w-6xl mx-auto">
            <SystematicReviewFlow />
          </div>



        </div>
      </section>

      {/* Features Grid */}
      <FeatureGrid />

      {/* Call to Action - Your improved version */}
      <section className="py-24">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <h2 className={`text-4xl font-bold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Ready to Accelerate Your Review Process?
      </h2>
      <p className={`text-xl ${
        theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
      }`}>
        Start using RapidReview to increase your systematic review output.
      </p>
      <div className="flex gap-4 justify-center">
        <Button 
          size="lg"
          className={
            theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          onClick={() => window.location.href = '/login'}
        >
          Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button 
          size="lg"
          variant="outline"
          className={
            theme === 'dark'
              ? 'border-neutral-700 text-white hover:bg-neutral-800'
              : 'border-gray-300 text-gray-900 hover:bg-gray-100'
          }
          onClick={() => window.location.href = '/login'}
        >
          Watch Demo
        </Button>
      </div>
    </div>
  </div>
</section>

{/* Simplified Footer */}
<footer className="py-12">
  <div className="container mx-auto px-4">
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center">
        <Zap className={`w-6 h-6 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`} />
        <span className={`text-xl font-bold ml-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>RapidReview</span>
      </div>
      
      <div className="flex space-x-6">
        {['Terms', 'Privacy', 'Contact'].map((item) => (
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

      <div className={`text-sm ${
        theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
      }`}>
        © {new Date().getFullYear()} RapidReview. All rights reserved.
      </div>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;