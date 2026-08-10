'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {children}
    </div>
  );
}
