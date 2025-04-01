import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoundTag } from '@shared/schema';

interface MetaTagsListProps {
  tags: FoundTag[];
}

export default function MetaTagsList({ tags }: MetaTagsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-green-50',
          border: 'border-green-100',
          text: 'text-green-700',
          icon: 'text-green-500',
          badge: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'needs-improvement':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          text: 'text-amber-700',
          icon: 'text-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'missing':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          text: 'text-red-700',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-100',
          text: 'text-gray-700',
          icon: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  // Group tags by status
  const tagsByStatus = tags.reduce((acc, tag) => {
    acc[tag.status] = acc[tag.status] || [];
    acc[tag.status].push(tag);
    return acc;
  }, {} as Record<string, FoundTag[]>);

  // Calculate statistics
  const totalTags = tags.length;
  const goodCount = (tagsByStatus['good'] || []).length;
  const improvementCount = (tagsByStatus['needs-improvement'] || []).length;
  const missingCount = (tagsByStatus['missing'] || []).length;

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <h2 className="text-xl font-bold gradient-heading">Meta Tags Overview</h2>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 shadow-sm">
              <i className="ri-check-line mr-1"></i> {goodCount} Good
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 shadow-sm">
              <i className="ri-error-warning-line mr-1"></i> {improvementCount} Needs Improvement
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 shadow-sm">
              <i className="ri-close-line mr-1"></i> {missingCount} Missing
            </Badge>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {tags.map((tag, index) => {
              const colors = getStatusColor(tag.status);
              
              return (
                <li key={index} className={`p-4 hover:${colors.bg} transition-colors duration-200`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center h-10 w-10 rounded-full ${colors.bg} border ${colors.border}`}>
                        <i className={`${tag.icon} text-lg ${colors.icon}`}></i>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-base font-medium">{tag.type}</h3>
                        <Badge variant="outline" className={`${colors.badge}`}>
                          {tag.status === 'good' && 'Good'}
                          {tag.status === 'needs-improvement' && 'Needs Improvement'}
                          {tag.status === 'missing' && 'Missing'}
                          {tag.status === 'error' && 'Error'}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-3">
                        {tag.content.length > 0 ? (
                          tag.content.map((content, i) => (
                            <div key={i} className="relative">
                              <pre className="bg-white border border-gray-200 p-3 rounded-md text-sm font-mono overflow-x-auto shadow-sm">
                                {content}
                              </pre>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
                            <i className="ri-alert-line mr-2"></i>
                            <p className="text-sm">
                              No {tag.type} found. Consider adding this tag for better search visibility.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
