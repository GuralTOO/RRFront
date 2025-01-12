import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Lock, 
  Brain,
  FileText,
  BarChart2,
  Check
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { DatabaseIllustration, ScreeningIllustration, SecurityIllustration, ExtractionIllustration, AnalyticsIllustration } from './Illustrations';

// Enhanced FeatureCard with proper light/dark styling
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  bulletPoints = [], 
  illustration: Illustration,
  size = "normal"
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className={`rounded-lg border transition-all overflow-hidden ${
        size === "large" ? "md:col-span-2 md:row-span-2" : ""
      } ${
        theme === 'dark'
          ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-8 h-full flex flex-col">
        <div>
          <div className={`mb-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {Icon && <Icon size={24} />}
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{title}</h3>
          <p className={
            theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
          }>{description}</p>
        </div>

        {bulletPoints.length > 0 && (
          <ul className="space-y-2 mt-4">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-center">
                <Check className={`w-4 h-4 mr-2 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={
                  theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
                }>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {Illustration && (
          <div className="flex-1 relative mt-6 min-h-[200px]">
            <div className={`absolute inset-0 rounded-lg ${
              theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-50'
            }`}>
              <Illustration />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Feature Grid Layout
const FeatureGrid = () => {
  const { theme } = useTheme();
  
  return (
    <section className={
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }>
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Database}
            title="Systematic Review Database"
            description="Every project gets a dedicated review database with powerful search and filtering capabilities."
            bulletPoints={[
              "100% PRISMA compliant",
              "Built-in inclusion criteria",
              "Easy data export"
            ]}
            size="large"
            illustration={DatabaseIllustration}
          />
          
          <FeatureCard
            icon={Brain}
            title="AI Screening"
            description="Automate paper screening with validated AI algorithms."
            bulletPoints={[
              "92% accuracy rate",
              "Human-in-the-loop",
              "Continuous learning"
            ]}
            illustration={ScreeningIllustration}
          />
          
          <FeatureCard
            icon={Lock}
            title="Team Management"
            description="Secure collaboration with role-based access control."
            bulletPoints={[
              "Granular permissions",
              "Activity tracking",
              "Audit logs"
            ]}
            illustration={SecurityIllustration}
          />
          
          <FeatureCard
            icon={FileText}
            title="Data Extraction"
            description="Extract and validate data with customizable forms."
            size="large"
            illustration={ExtractionIllustration}
          />
          
          <FeatureCard
            icon={BarChart2}
            title="Analytics"
            description="Real-time insights into your review progress."
            illustration={AnalyticsIllustration}
          />
        </div>

        <div className={`text-center mt-12 ${
          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
        }`}>
          <p className="text-lg">
            Use any feature independently or as an integrated platform.
          </p>
        </div>
      </div>
    </section>
  );
};


// Export all components
export { FeatureCard, FeatureGrid };