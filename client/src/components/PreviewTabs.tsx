import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GooglePreview, SocialPreview, TagResult } from '@shared/schema';

interface PreviewTabsProps {
  googlePreview: GooglePreview;
  facebookPreview: SocialPreview;
  twitterPreview: SocialPreview;
}

export default function PreviewTabs({ googlePreview, facebookPreview, twitterPreview }: PreviewTabsProps) {
  // Common analysis component for all tabs
  const TagAnalysis = ({ analysis }: { analysis: TagResult[] }) => {
    // Count items by status
    const statusCounts = analysis.reduce((acc, tag) => {
      acc[tag.status] = (acc[tag.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return (
      <div className="mt-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <h4 className="text-base font-medium gradient-heading mr-3">Analysis</h4>
          {statusCounts['good'] > 0 && 
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              <i className="ri-check-line mr-1"></i> {statusCounts['good']} Good
            </Badge>
          }
          {statusCounts['needs-improvement'] > 0 && 
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
              <i className="ri-error-warning-line mr-1"></i> {statusCounts['needs-improvement']} Needs Improvement
            </Badge>
          }
          {statusCounts['missing'] > 0 && 
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              <i className="ri-close-line mr-1"></i> {statusCounts['missing']} Missing
            </Badge>
          }
        </div>
        
        <ul className="space-y-3">
          {analysis.map((tag, index) => {
            let iconClass = '';
            let bgClass = '';
            
            if (tag.status === 'good') {
              iconClass = 'ri-check-line text-green-500';
              bgClass = 'bg-green-50 border-green-100';
            } else if (tag.status === 'needs-improvement') {
              iconClass = 'ri-error-warning-line text-amber-500';
              bgClass = 'bg-amber-50 border-amber-100';
            } else if (tag.status === 'missing') {
              iconClass = 'ri-close-line text-red-500';
              bgClass = 'bg-red-50 border-red-100';
            } else {
              iconClass = 'ri-information-line text-gray-500';
              bgClass = 'bg-gray-50 border-gray-100';
            }
            
            return (
              <li key={index} className={`flex items-start p-3 rounded-md border ${bgClass}`}>
                <div className="flex-shrink-0 mt-0.5">
                  <i className={`${iconClass} text-lg`}></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{tag.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{tag.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 gradient-heading">Preview & Analysis</h2>
        
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <i className="ri-google-line text-lg"></i>
              <span className="hidden sm:inline">Google</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <i className="ri-facebook-box-line text-lg"></i>
              <span className="hidden sm:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <i className="ri-twitter-x-line text-lg"></i>
              <span className="hidden sm:inline">Twitter</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Google Preview Tab */}
          <TabsContent value="google" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-base font-medium mb-4 text-primary">Google Search Result Preview</h3>
              <div className="border border-gray-200 p-4 rounded-md shadow-sm">
                <div className="text-xl mb-1 text-[#1a0dab] truncate hover:text-primary transition-colors duration-200">{googlePreview.title}</div>
                <div className="text-sm mb-2 text-[#006621] truncate">{googlePreview.url}</div>
                <div className="text-sm text-gray-700 line-clamp-2">
                  {googlePreview.description}
                </div>
              </div>
              
              <TagAnalysis analysis={googlePreview.analysis} />
            </div>
          </TabsContent>
          
          {/* Facebook Preview Tab */}
          <TabsContent value="facebook" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-base font-medium mb-4 text-primary">Facebook Share Preview</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mx-auto max-w-lg">
                {facebookPreview.image ? (
                  <div className="bg-gray-100">
                    <div className="w-full h-64 bg-gray-200" style={{
                      backgroundImage: `url(${facebookPreview.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                    <i className="ri-image-line text-4xl"></i>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <div className="text-xs text-gray-500 uppercase">{new URL(facebookPreview.url).hostname}</div>
                  <h2 className="text-base font-medium my-1">{facebookPreview.title}</h2>
                  <p className="text-sm text-gray-700 line-clamp-2">{facebookPreview.description}</p>
                </div>
              </div>
              
              <TagAnalysis analysis={facebookPreview.analysis} />
            </div>
          </TabsContent>
          
          {/* Twitter Preview Tab */}
          <TabsContent value="twitter" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-base font-medium mb-4 text-primary">Twitter Card Preview</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mx-auto max-w-lg">
                {twitterPreview.image ? (
                  <div className="bg-gray-100">
                    <div className="w-full h-60 bg-gray-200" style={{
                      backgroundImage: `url(${twitterPreview.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                    <i className="ri-image-line text-4xl"></i>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h2 className="text-base font-medium">{twitterPreview.title}</h2>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{twitterPreview.description}</p>
                  <div className="text-xs text-gray-500 mt-2">{new URL(twitterPreview.url).hostname}</div>
                </div>
              </div>
              
              <TagAnalysis analysis={twitterPreview.analysis} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
