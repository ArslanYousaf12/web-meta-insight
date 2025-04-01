import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2">
            <a href="https://github.com" className="text-gray-400 hover:text-gray-500" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">GitHub</span>
              <i className="ri-github-fill text-xl"></i>
            </a>
            <a href="https://twitter.com" className="ml-6 text-gray-400 hover:text-gray-500" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Twitter</span>
              <i className="ri-twitter-fill text-xl"></i>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
