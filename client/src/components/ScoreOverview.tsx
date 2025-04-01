import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreData } from '@shared/schema';

interface ScoreOverviewProps {
  analyzedUrl: string;
  scoreData: ScoreData;
}

export default function ScoreOverview({ analyzedUrl, scoreData }: ScoreOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Success green
    if (score >= 60) return '#F59E0B'; // Warning yellow
    return '#EF4444'; // Error red
  };

  const CircleProgress = ({ percentage }: { percentage: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="w-20 h-20 relative">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle 
            r={radius} 
            cx="40" 
            cy="40" 
            fill="transparent" 
            stroke="#E5E7EB" 
            strokeWidth="8"
          />
          <circle 
            r={radius} 
            cx="40" 
            cy="40" 
            fill="transparent" 
            stroke={getScoreRingColor(percentage)} 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold">{percentage}%</span>
        </div>
      </div>
    );
  };

  const ScoreCard = ({ 
    icon, 
    title, 
    score, 
    total 
  }: { 
    icon: string; 
    title: string; 
    score: number; 
    total: number 
  }) => {
    const percentage = Math.round((score / total) * 100);
    const bgColorClass = score >= total * 0.8 ? 'bg-green-50' : score >= total * 0.6 ? 'bg-amber-50' : 'bg-red-50';
    const textColorClass = score >= total * 0.8 ? 'text-green-500' : score >= total * 0.6 ? 'text-amber-500' : 'text-red-500';
    
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
                <i className={`${icon} text-xl ${textColorClass}`}></i>
              </div>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="flex items-center">
                <p className={`text-lg font-semibold ${textColorClass}`}>
                  {score}/{total}
                </p>
                <span className={`ml-1 text-xs ${getScoreColor(percentage)} px-2 py-0.5 rounded-full`}>
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-800">SEO Score Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Analysis for <span className="font-medium">{analyzedUrl}</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" className="inline-flex items-center">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CircleProgress percentage={scoreData.overall} />
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">Overall Score</h3>
                  <p className={`mt-1 text-lg font-semibold ${
                    scoreData.overall >= 80 ? 'text-green-600' : 
                    scoreData.overall >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {getScoreText(scoreData.overall)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Essential Tags */}
          <ScoreCard 
            icon="ri-file-text-line" 
            title="Essential Tags" 
            score={scoreData.essential.score} 
            total={scoreData.essential.total} 
          />
          
          {/* Social Media */}
          <ScoreCard 
            icon="ri-share-line" 
            title="Social Media" 
            score={scoreData.social.score} 
            total={scoreData.social.total} 
          />
          
          {/* Advanced SEO */}
          <ScoreCard 
            icon="ri-code-line" 
            title="Advanced SEO" 
            score={scoreData.advanced.score} 
            total={scoreData.advanced.total} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
