import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UrlFormProps {
  onAnalyze: (url: string) => void;
}

export default function UrlForm({ onAnalyze }: UrlFormProps) {
  const [url, setUrl] = useState('');

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
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">Analyze Website SEO Tags</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-grow">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-links-line text-gray-400"></i>
                </div>
                <Input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 pr-12 py-3"
                  placeholder="https://example.com"
                  required
                />
                {url && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter the full URL including http:// or https://
              </p>
            </div>
            <div className="sm:self-end">
              <Button
                type="submit"
                className="w-full py-3"
                disabled={!isValidUrl(url)}
              >
                <span>Analyze SEO Tags</span>
                <i className="ri-search-line ml-2"></i>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
