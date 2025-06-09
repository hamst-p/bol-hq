'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BowlViewer from '../components/BowlViewer';
import AnimatedImage from '../components/AnimatedImage';

// Memoize the animated background to prevent unnecessary re-renders
const AnimatedBackground = React.memo(({ count }: { count: number }) => {
  const imageInstances = Array(count).fill('/images/bolana.png');
  
  return (
    <div className="fixed inset-0 z-0">
      {imageInstances.map((src, index) => (
        <AnimatedImage key={index} src={src} />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default function ThreeDPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Optimized background layer with reduced number of images */}
      <AnimatedBackground count={150} />

      {/* Content layer with higher z-index */}
      <div className="relative z-10">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-8 text-white">3D BOL EXPERIMENT</h1>
          <BowlViewer />
        </main>

        <Footer />
      </div>
    </div>
  );
} 