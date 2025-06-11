// app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Tooltip } from '@react95/core';
import Header from './components/Header';
import Footer from './components/Footer';
import Video from './components/Video';
import ButtonGroup from './components/ButtonGroup';
import FloatingBowl from './components/FloatingBowl';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#53bba5]">
      <Header />

      <main className="flex-1 flex flex-col items-center gap-8 p-8 sm:p-20">
        <FloatingBowl />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">is boowl.</li>
        </ol>

        <ButtonGroup />

        <Video
          width={480}
          height={270}
          title="BOLANA_TV.wav"
        />
      </main>

      <Footer />
    </div>
  );
}
