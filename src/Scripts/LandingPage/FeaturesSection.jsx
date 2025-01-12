import React from 'react';
import { 
  Users, Brain, FileText, BarChart, 
  Search, Clock, Shield, GitMerge, 
  BookOpen, Database, MessageSquare, Award, ChevronUp, ChevronDown, Check
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const FeaturesSection = () => {
  const featureGroups = [
    {
      id: 'setup',
      title: "Review Setup & Organization",
      primaryFeature: true,
      features: [
        {
          icon: <Users />,
          title: "Role-Based Access Control",
          description: "Comprehensive team management with granular permissions and customizable workflows.",
          benefits: [
            "Custom permission sets for different team roles",
            "Hierarchical review structure",
            "Real-time activity monitoring",
            "Team performance analytics"
          ]
        },
        {
          icon: <Brain />,
          title: "AI-Generated Criteria",
          description: "Let our AI analyze your research question and generate tailored inclusion/exclusion criteria.",
          benefits: [
            "Smart criteria suggestions based on your topic",
            "Learning from successful past reviews",
            "Customizable templates",
            "Automatic validation checks"
          ]
        },
        {
          icon: <FileText />,
          title: "Universal Import System",
          description: "Seamlessly import papers from any major academic database or citation manager.",
          benefits: [
            "Support for PubMed, Scopus, Web of Science",
            "Automatic deduplication",
            "Citation manager integration",
            "Bulk PDF handling"
          ]
        },
        {
          icon: <Search />,
          title: "Smart Search Integration",
          description: "Advanced search capabilities across all your imported papers and annotations.",
          benefits: [
            "Full-text semantic search",
            "Filter by any metadata field",
            "Save and share search queries",
            "Citation network analysis"
          ]
        }
      ]
    },
    {
      id: 'process',
      title: "Review Process Management",
      features: [
        {
          icon: <GitMerge />,
          title: "Consensus Building",
          description: "Streamlined process for reaching agreement between reviewers with built-in conflict resolution.",
          benefits: [
            "Automated agreement tracking",
            "Configurable consensus thresholds",
            "Structured discussion threads",
            "Decision audit trail"
          ]
        },
        {
          icon: <Clock />,
          title: "Progress Tracking",
          description: "Real-time insights into your review progress with predictive completion estimates.",
          benefits: [
            "Visual progress dashboards",
            "Automated reviewer reminders",
            "Workload balancing suggestions",
            "Time tracking and estimation"
          ]
        },
        {
          icon: <Shield />,
          title: "Quality Assurance",
          description: "Built-in tools to ensure consistency and quality throughout your review process.",
          benefits: [
            "Automated quality checks",
            "Random sample validation",
            "Inter-rater reliability metrics",
            "Review protocol compliance"
          ]
        },
        {
          icon: <MessageSquare />,
          title: "Team Communication",
          description: "Integrated communication tools to keep everyone aligned and informed.",
          benefits: [
            "Contextual commenting",
            "@mentions and notifications",
            "Decision documentation",
            "Team announcements"
          ]
        }
      ]
    },
    {
      id: 'analysis',
      title: "Data Analysis & Export",
      features: [
        {
          icon: <Database />,
          title: "Data Extraction",
          description: "Structured data extraction with customizable forms and AI assistance.",
          benefits: [
            "Template-based extraction forms",
            "AI-powered field suggestions",
            "Batch data entry",
            "Quality control checks"
          ]
        },
        {
          icon: <BarChart />,
          title: "Analytics Dashboard",
          description: "Comprehensive analytics and visualizations for your systematic review data.",
          benefits: [
            "Interactive data visualizations",
            "Statistical analysis tools",
            "Custom report generation",
            "Export in multiple formats"
          ]
        },
        {
          icon: <BookOpen />,
          title: "PRISMA Integration",
          description: "Automatic generation of PRISMA diagrams and compliance reports.",
          benefits: [
            "Dynamic PRISMA flow diagrams",
            "Compliance checklist",
            "Automatic updates",
            "Export-ready graphics"
          ]
        },
        {
          icon: <Award />,
          title: "Publication Ready",
          description: "Export your results in formats ready for publication or presentation.",
          benefits: [
            "Journal-specific formatting",
            "Citation style customization",
            "Figure generation",
            "Supplementary material preparation"
          ]
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Enterprise-Grade Project Management
          </h2>
          <p className="text-xl text-gray-600">
            Powerful tools to streamline every aspect of your systematic review,
            from initial setup to final publication.
          </p>
        </div>

        <div className="space-y-12">
          {featureGroups.map((group) => (
            <FeatureGroup
              key={group.id}
              title={group.title}
              primaryFeature={group.primaryFeature}
              features={group.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Assuming FeatureGroup component from previous artifact
const FeatureGroup = ({ title, features, primaryFeature }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <Card className="overflow-hidden">
      <button 
        className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
        {isExpanded ? 
          <ChevronUp className="w-5 h-5 text-blue-600" /> : 
          <ChevronDown className="w-5 h-5 text-blue-600" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side: Visual representation */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-gray-50 p-8 flex items-center justify-center">
                <img 
                  src="/api/placeholder/400/400"
                  alt={`${title} illustration`}
                  className="w-full h-full object-contain"
                />
              </div>
              {primaryFeature && (
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
            </div>

            {/* Right side: Features list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {React.cloneElement(feature.icon, {
                      className: "w-6 h-6 text-blue-600"
                    })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    {feature.benefits && (
                      <ul className="mt-3 space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-500">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FeaturesSection;