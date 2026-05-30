import React from 'react';

export const MatchSkeleton = () => {
  return (
    <div className="bg-wc-white/[0.03] backdrop-blur-md border border-wc-white/5 rounded-2xl p-4 md:p-5 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Info & Teams (cols 1-5) */}
        <div className="md:col-span-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 bg-wc-white/10 rounded-full"></div>
            <div className="h-4 w-12 bg-wc-white/5 rounded-full"></div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-wc-white/5 rounded-full"></div>
                <div className="h-3 w-24 bg-wc-white/5 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-wc-white/5 rounded-full"></div>
                <div className="h-3 w-24 bg-wc-white/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Markets (cols 6-12) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:border-l md:border-wc-white/5 md:pl-5">
          {/* Outcome Market Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-16 bg-wc-white/5 rounded-full"></div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-10 bg-wc-white/5 rounded-xl"></div>
              <div className="h-10 bg-wc-white/5 rounded-xl"></div>
              <div className="h-10 bg-wc-white/5 rounded-xl"></div>
            </div>
          </div>

          {/* Exact Market Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-20 bg-wc-white/5 rounded-full"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-wc-white/5 rounded-xl"></div>
              <div className="w-14 h-10 bg-wc-white/5 rounded-xl"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
