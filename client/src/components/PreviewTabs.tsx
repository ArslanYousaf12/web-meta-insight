import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GooglePreview, SocialPreview, TagResult } from '@shared/schema';

interface PreviewTabsProps {
  googlePreview: GooglePreview;
  facebookPreview: SocialPreview;
  twitterPreview: SocialPreview;
}

export default function PreviewTabs({ googlePreview, facebookPreview, twitterPreview }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'facebook' | 'twitter'>('google');

  // Common analysis component for all tabs
  const TagAnalysis = ({ analysis }: { analysis: TagResult[] }) => (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-800 mb-2">Analysis</h4>
      <ul className="space-y-3">
        {analysis.map((tag, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {tag.status === 'good' && <i className="ri-check-line text-green-500"></i>}
              {tag.status === 'needs-improvement' && <i className="ri-error-warning-line text-amber-500"></i>}
              {tag.status === 'missing' && <i className="ri-close-line text-red-500"></i>}
            </div>
            <p className="ml-2 text-sm text-gray-600">
              <span className="font-medium">{tag.name}:</span> {tag.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            onClick={() => setActiveTab('google')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'google' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Google Preview
          </button>
          <button 
            onClick={() => setActiveTab('facebook')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'facebook' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Facebook Preview
          </button>
          <button 
            onClick={() => setActiveTab('twitter')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'twitter' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Twitter Preview
          </button>
        </nav>
      </div>
      
      {/* Google Preview Tab */}
      {activeTab === 'google' && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <h3 className="text-base font-medium mb-4">Google Search Result Preview</h3>
            <div className="border border-gray-200 p-4 rounded-md">
              <div className="text-xl mb-1 text-[#1a0dab]">{googlePreview.title}</div>
              <div className="text-sm mb-2 text-[#006621]">{googlePreview.url}</div>
              <div className="text-sm text-gray-700">
                {googlePreview.description}
              </div>
            </div>
            
            <TagAnalysis analysis={googlePreview.analysis} />
          </CardContent>
        </Card>
      )}
      
      {/* Facebook Preview Tab */}
      {activeTab === 'facebook' && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <h3 className="text-base font-medium mb-4">Facebook Share Preview</h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden max-w-lg">
              {facebookPreview.image && (
                <div className="bg-gray-100">
                  <div className="w-full h-64 bg-gray-200" style={{
                    backgroundImage: `url(${facebookPreview.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                </div>
              )}
              <div className="p-3 bg-white">
                <div className="text-xs text-gray-500 uppercase">{new URL(facebookPreview.url).hostname}</div>
                <h2 className="text-base font-medium">{facebookPreview.title}</h2>
                <p className="text-sm text-gray-700 mt-1">{facebookPreview.description}</p>
              </div>
            </div>
            
            <TagAnalysis analysis={facebookPreview.analysis} />
          </CardContent>
        </Card>
      )}
      
      {/* Twitter Preview Tab */}
      {activeTab === 'twitter' && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <h3 className="text-base font-medium mb-4">Twitter Card Preview</h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden max-w-lg">
              {twitterPreview.image && (
                <div className="bg-gray-100">
                  <div className="w-full h-60 bg-gray-200" style={{
                    backgroundImage: `url(${twitterPreview.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                </div>
              )}
              <div className="p-3 bg-white">
                <h2 className="text-base font-medium">{twitterPreview.title}</h2>
                <p className="text-sm text-gray-700 mt-1">{twitterPreview.description}</p>
                <div className="text-xs text-gray-500 mt-2">{new URL(twitterPreview.url).hostname}</div>
              </div>
            </div>
            
            <TagAnalysis analysis={twitterPreview.analysis} />
          </CardContent>
        </Card>
      )}
    </section>
  );
}
