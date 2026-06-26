'use client';

import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import PredictionForm from '@/components/sections/PredictionForm';
import { useState } from 'react';

export default function Home() {
  const [prediction, setPrediction] =
    useState<number | null>(null);

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <Hero />
        <PredictionForm setPrediction={setPrediction} />
        <Footer />
      </div>
    </main>
  );
}