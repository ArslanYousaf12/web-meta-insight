import React from 'react';
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="hero-pattern border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg">
                <i className="ri-search-line text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold gradient-heading">SEO Tag Analyzer</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <i className="ri-information-line"></i>
                <span className="hidden sm:inline">About</span>
              </Button>
              <Button size="sm" className="flex items-center gap-1 btn-gradient">
                <i className="ri-question-line"></i>
                <span>Help</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
