import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UrlFormProps {
  onAnalyze: (url: string) => void;
}

export default function UrlForm({ onAnalyze }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl(url)) {
      onAnalyze(url);
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardContent className="pt-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div 
                className={`
                  relative rounded-md overflow-hidden shadow-sm transition-all duration-200
                  ${isFocused ? 'ring-2 ring-primary/50 shadow-md' : 'shadow'}
                `}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-links-line text-gray-400 text-lg"></i>
                </div>
                <Input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="pl-11 pr-11 py-6 text-base md:text-lg border-none"
                  placeholder="Enter website URL (https://example.com)"
                  required
                />
                {url && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors duration-200"
                    >
                      <i className="ri-close-line text-lg"></i>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500 pl-1">
                Enter the full URL including http:// or https://
              </p>
            </div>
            <div className="md:self-start">
              <Button
                type="submit"
                className="w-full md:w-auto py-6 px-8 btn-gradient text-base"
                disabled={!isValidUrl(url)}
              >
                <i className="ri-search-line mr-2 text-lg"></i>
                <span>Analyze</span>
              </Button>
            </div>
          </div>
          
          <div className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-flex w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Fast Analysis
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-flex w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
              SEO Score
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-flex w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
              Preview in Google & Social
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-flex w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
              Actionable Recommendations
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
