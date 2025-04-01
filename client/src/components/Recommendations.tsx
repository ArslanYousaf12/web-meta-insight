import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recommendation } from '@shared/schema';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  // Group recommendations by type
  const criticalIssues = recommendations.filter(rec => rec.type === 'critical');
  const improvements = recommendations.filter(rec => rec.type === 'improvement');
  const goodPractices = recommendations.filter(rec => rec.type === 'good');

  const RecommendationItem = ({ rec, index }: { rec: Recommendation, index: number }) => {
    const getBgColor = () => {
      switch(rec.type) {
        case 'critical': return 'bg-red-50 border-red-100';
        case 'improvement': return 'bg-amber-50 border-amber-100';
        case 'good': return 'bg-green-50 border-green-100';
        default: return 'bg-gray-50 border-gray-100';
      }
    };
    
    const getIconColor = () => {
      switch(rec.type) {
        case 'critical': return 'text-red-500 bg-red-100';
        case 'improvement': return 'text-amber-500 bg-amber-100';
        case 'good': return 'text-green-500 bg-green-100';
        default: return 'text-gray-500 bg-gray-100';
      }
    };
    
    const getBadge = () => {
      switch(rec.type) {
        case 'critical': 
          return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
        case 'improvement': 
          return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Improvement</Badge>;
        case 'good': 
          return <Badge className="bg-green-100 text-green-800 border-green-200">Good Practice</Badge>;
        default: 
          return null;
      }
    };
    
    return (
      <li key={index} className={`rounded-lg border p-4 ${getBgColor()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${getIconColor()}`}>
              <i className={`${rec.icon} text-lg`}></i>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
              <h3 className="text-base font-medium">{rec.title}</h3>
              {getBadge()}
            </div>
            <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
            {rec.link && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1 text-xs"
                asChild
              >
                <a 
                  href={rec.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="ri-external-link-line mr-1"></i>
                  {rec.link.text}
                </a>
              </Button>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold gradient-heading">Recommendations</h2>
          <div className="flex gap-2 ml-auto flex-wrap justify-end">
            {criticalIssues.length > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                <i className="ri-error-warning-line mr-1"></i> {criticalIssues.length} Critical
              </Badge>
            )}
            {improvements.length > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                <i className="ri-tools-line mr-1"></i> {improvements.length} Improvements
              </Badge>
            )}
            {goodPractices.length > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <i className="ri-checkbox-circle-line mr-1"></i> {goodPractices.length} Good Practices
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {criticalIssues.length > 0 && (
            <div>
              <h3 className="text-base font-medium mb-3 text-red-600 flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                Critical Issues to Fix
              </h3>
              <ul className="space-y-3">
                {criticalIssues.map((rec, index) => (
                  <RecommendationItem key={index} rec={rec} index={index} />
                ))}
              </ul>
            </div>
          )}
          
          {improvements.length > 0 && (
            <div>
              <h3 className="text-base font-medium mb-3 text-amber-600 flex items-center">
                <i className="ri-tools-line mr-2"></i>
                Suggested Improvements
              </h3>
              <ul className="space-y-3">
                {improvements.map((rec, index) => (
                  <RecommendationItem key={index} rec={rec} index={index} />
                ))}
              </ul>
            </div>
          )}
          
          {goodPractices.length > 0 && (
            <div>
              <h3 className="text-base font-medium mb-3 text-green-600 flex items-center">
                <i className="ri-checkbox-circle-line mr-2"></i>
                Good Practices Implemented
              </h3>
              <ul className="space-y-3">
                {goodPractices.map((rec, index) => (
                  <RecommendationItem key={index} rec={rec} index={index} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
