import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message: string;
  onTryAgain: () => void;
}

export default function ErrorState({ message, onTryAgain }: ErrorStateProps) {
  return (
    <Card className="bg-red-50 border border-red-500">
      <CardContent className="py-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className="ri-error-warning-line text-2xl text-red-500"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-600">Error analyzing website</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
            <div className="mt-4">
              <Button 
                variant="destructive" 
                onClick={onTryAgain}
              >
                Try Again
                <i className="ri-refresh-line ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
