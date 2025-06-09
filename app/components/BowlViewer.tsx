'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const BowlCanvas = dynamic(
  () =>
    import('./BowlCanvas').catch((err) => {
      console.error('Error loading BowlCanvas:', err);
      return () => null;
    }),
  { ssr: false }
);

export default function BowlViewer() {
  return (
    <div className="w-full h-screen relative z-10">
      <BowlCanvas />
    </div>
  );
} 