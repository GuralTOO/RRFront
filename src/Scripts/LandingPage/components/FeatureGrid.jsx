import React from 'react';
import {
  ShieldCheck,
  Users,
  Brain,
  FileText,
  BarChart2,
  Upload,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import PrismaIllustration from './Illustrations/PrismaIllustration';
import CursorFlow from './Illustrations/CursorFlow';
import ImportAnimation from './Illustrations/ImportAnimation';
import FeatureCard from './FeatureCard';
import AIScreeningAnimation from './Illustrations/AIScreeningAnimation';
import AnalyticsAnimation from './Illustrations/AnalyticsAnimation';
import DocumentExportAnimation from './Illustrations/DocumentExportAnimation';

const FeatureGrid = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`${
      theme === 'dark'
        ? 'bg-black'
        : 'bg-gradient-to-b from-gray-50 to-gray-100/50'
    } py-24 lg:py-32`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content container with reduced max-width */}
        <div className="max-w-6xl mx-auto">
          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
            {/* Best Practices - Wide card */}
            <div className="md:col-span-4">
              <FeatureCard
                icon={ShieldCheck}
                title="Review Best Practices"
                bulletPoints={[
                  "Aligned with PRISMA and Cochrane guidelines",
                  "Structured independent screening",
                  "Consensus-based decision making",
                  "Conflict resolution"
                ]}
                size="medium"
                illustration={PrismaIllustration}
              />
            </div>

            {/* Team Work - Narrow card */}
            <div className="md:col-span-2">
              <FeatureCard
                icon={Users}
                title={'Team Work'}
                description="Collaborate with your teammates"
                bulletPoints={[
                  "Unlimited collaborators",
                  "Role-based access control",
                  "Complete audit trails"
                ]}
                illustration={CursorFlow}
              />
            </div>

            {/* Second row */}
            {/* Universal Import - Narrow card */}
            <div className="md:col-span-2">
              <FeatureCard
                icon={Upload} // From lucide-react
                title="Universal Import"
                description="Import references from any major platform"
                bulletPoints={[
                  "Support for RIS, PubMed, and Covidence",
                  "Automatic deduplication",
                  "Smart search and filtering"
                ]}
                illustration={ImportAnimation}
              />
            </div>

            {/* AI Screening - Wide card */}
            <div className="md:col-span-4">
              <FeatureCard
                icon={Brain}
                title="AI Assisted Screening"
                description="Speed up your screening process with AI"
                bulletPoints={[
                  "Smart paper ranking by relevance",
                  "AI-powered inclusion criteria matching",
                  "Assisted Data Extraction (coming soon)"
                ]}
                size="medium"
                illustration={AIScreeningAnimation}
              />
            </div>
            <div className="md:col-span-3">
              <FeatureCard
                icon={BarChart2}
                title="Real-Time Analytics"
                description="Current insights into your review progress."
                bulletPoints={[
                  "Team productivity metrics",
                  "Screening progress tracking",
                ]}
                illustration={AnalyticsAnimation}
              />
            </div>

            <div className="md:col-span-3">
              <FeatureCard
                icon={FileText}
                title="Export Documentation"
                description="Export a complete audit trail of your review."
                bulletPoints={[
                  "PRISMA-compliant audit logs",
                  "Decision history tracking",
                  "Reviewer attribution data"
                ]}
                illustration={DocumentExportAnimation}
              />
            </div>
          </div>

          {/* Bottom text */}
          <div className="mt-16 text-center">
            <p className={`text-lg font-medium ${
              theme === 'dark'
                ? 'text-neutral-400'
                : 'text-gray-600'
            }`}>
              Use any feature independently or as an integrated platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;