import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 gradient-heading">SEO Tag Analyzer</h3>
            <p className="text-sm text-gray-500 text-center md:text-left">
              Analyze any website's SEO meta tags and get instant insights to improve your search engine visibility.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  SEO Best Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Meta Tags Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Google Search Console
                </a>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="text-gray-400 hover:text-primary transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <i className="ri-github-fill text-2xl"></i>
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-400 hover:text-primary transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <i className="ri-twitter-x-fill text-2xl"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-400 hover:text-primary transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <i className="ri-linkedin-box-fill text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
