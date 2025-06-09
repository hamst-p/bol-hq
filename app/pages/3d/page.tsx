'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BowlViewer from '../../components/BowlViewer';
import MatrixBackground from '../../components/MatrixBackground';

export default function ThreeDPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MatrixBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20">
        <h1 className="text-2xl font-bold mb-8 text-white">3D BOL</h1>
        <BowlViewer />
      </main>

      <Footer />
    </div>
  );
} 