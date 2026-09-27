import React from 'react';

const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      {/* Airplane SVG icon */}
      <div className="relative w-16 h-16">
        <svg
          className="w-16 h-16 text-brandPrimary animate-[fly_1.4s_ease-in-out_infinite]"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
        {/* Dashed trail */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brandPrimary opacity-80 animate-[bounce_1.4s_0s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-brandPrimary opacity-50 animate-[bounce_1.4s_0.2s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-brandAccent opacity-30 animate-[bounce_1.4s_0.4s_infinite]" />
        </div>
      </div>
      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mt-6">Loading...</p>
    </div>

    <style>{`
      @keyframes fly {
        0%, 100% { transform: translateY(0) rotate(-10deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }
    `}</style>
  </div>
);

export default PageLoader;
