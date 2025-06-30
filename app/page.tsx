// app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Tooltip } from '@react95/core';
import Header from './components/Header';
import Footer from './components/Footer';
import Video from './components/Video';
import ButtonGroup from './components/ButtonGroup';
import FloatingBowl from './components/FloatingBowl';
import { Window, WindowHeader, WindowContent } from 'react95';

export default function Home() {
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const handleClose = () => setIsWindowOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#53bba5]">
      <Header />

      <main className="flex-1 flex flex-col items-center gap-8 p-8 sm:p-20">
        <FloatingBowl />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">is boowl.</li>
        </ol>

        <ButtonGroup width={480} />

        {isWindowOpen && (
          <Video
            width={480}
            height={270}
            title="BOLANA_TV.wav"
            onClose={handleClose}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
