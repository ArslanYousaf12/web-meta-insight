import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin w-12 h-12 text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800">Analyzing website...</h3>
        <p className="text-sm text-gray-500 mt-2">Fetching and parsing SEO tags from the website.</p>
      </CardContent>
    </Card>
  );
}
