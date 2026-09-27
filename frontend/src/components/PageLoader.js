import React from 'react';
import { Plane } from 'lucide-react';

const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col pt-20">
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full neo-pressed flex items-center justify-center mx-auto animate-pulse">
          <Plane className="w-6 h-6 text-brandPrimary" />
        </div>
        <p className="text-sm font-bold text-textSecondary">Loading...</p>
      </div>
    </div>
  </div>
);

export default PageLoader;
