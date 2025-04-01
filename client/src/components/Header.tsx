import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ri-search-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold text-gray-800">SEO Tag Analyzer</h1>
          </div>
          <div>
            <button className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <i className="ri-question-line mr-2"></i>
              Help
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
