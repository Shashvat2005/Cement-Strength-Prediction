'use client';

import Navbar from '@/components/layouts/Navbar';
import Hero from '@/components/sections/Hero';
import PredictionForm from '@/components/sections/PredictionForm';
import ResultCard from '@/components/sections/ResultCard';
import { useState } from 'react';

export default function Home() {
  const [prediction, setPrediction] =
    useState<number | null>(null);

  return (
    <main className="dashboard">
      <div className="dashboard-container">

        <Hero />

        <div className="dashboard-grid">

            <PredictionForm
            setPrediction={setPrediction}
            />

            <ResultCard
              strength={prediction}
            />

        </div>
      </div>
    </main>
  );
}