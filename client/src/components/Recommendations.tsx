import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from '@shared/schema';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  // Group recommendations by type
  const criticalIssues = recommendations.filter(rec => rec.type === 'critical');
  const improvements = recommendations.filter(rec => rec.type === 'improvement');
  const goodPractices = recommendations.filter(rec => rec.type === 'good');

  const renderRecommendationItem = (rec: Recommendation, index: number) => (
    <li key={index} className="flex items-start">
      <div className="flex-shrink-0 mt-0.5">
        <i className={`${rec.icon} ${
          rec.type === 'critical' ? 'text-red-500' : 
          rec.type === 'improvement' ? 'text-amber-500' : 'text-green-500'
        }`}></i>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{rec.title}</span> {rec.description}
        </p>
        {rec.link && (
          <div className="mt-2">
            <a 
              href={rec.link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              {rec.link.text}
            </a>
          </div>
        )}
      </div>
    </li>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">SEO Recommendations</h2>
        
        <div className="divide-y divide-gray-200">
          {criticalIssues.length > 0 && (
            <div className="py-4">
              <h3 className="text-md font-medium text-red-600 mb-2">Critical Issues</h3>
              <ul className="space-y-3 mt-2">
                {criticalIssues.map((rec, index) => renderRecommendationItem(rec, index))}
              </ul>
            </div>
          )}
          
          {improvements.length > 0 && (
            <div className="py-4">
              <h3 className="text-md font-medium text-amber-600 mb-2">Suggested Improvements</h3>
              <ul className="space-y-3 mt-2">
                {improvements.map((rec, index) => renderRecommendationItem(rec, index))}
              </ul>
            </div>
          )}
          
          {goodPractices.length > 0 && (
            <div className="py-4">
              <h3 className="text-md font-medium text-green-600 mb-2">Good Practices</h3>
              <ul className="space-y-3 mt-2">
                {goodPractices.map((rec, index) => renderRecommendationItem(rec, index))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
