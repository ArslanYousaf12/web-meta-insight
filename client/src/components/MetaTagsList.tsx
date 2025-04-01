import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoundTag } from '@shared/schema';

interface MetaTagsListProps {
  tags: FoundTag[];
}

export default function MetaTagsList({ tags }: MetaTagsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good</Badge>;
      case 'needs-improvement':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Improvement</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Missing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">All SEO Tags Found</h2>
        
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {tags.map((tag, index) => (
              <li key={index} className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100">
                      <i className={`${tag.icon} text-primary`}></i>
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{tag.type}</h3>
                      {getStatusBadge(tag.status)}
                    </div>
                    <div className="mt-1 space-y-2">
                      {tag.content.length > 0 ? (
                        tag.content.map((content, i) => (
                          <p key={i} className="text-sm text-gray-600">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{content}</code>
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">
                          No {tag.type} found. Consider adding this tag for better search visibility.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
