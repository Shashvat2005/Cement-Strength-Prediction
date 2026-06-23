"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-header">
        {/* 1. Flex container to hold the image and the text content side-by-side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* 2. The Small Image Container */}
          <div style={{ 
            position: 'relative', 
            width: '70px', 
            height: '70px', 
            flexShrink: 0 // Prevents the image from squishing
          }}>
            <Image 
              src="/ABG.jpeg" 
              alt="Hero" 
              fill
              style={{ objectFit: 'cover', borderRadius: '6px' }}
            />
          </div>

          {/* 3. The Text Container */}
          <div>
            {/* H1 and P are styled to stay inline with each other if needed, 
                or just sit tightly packed next to the image */}
            <h1 style={{ margin: 0, fontSize: '1.5rem', lineHeight: '1.2' }}>
              Cement Strength Predictor
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: '#555' }}>
              — Predict 28-Day Cement Strength using process quality parameters
            </p>
          </div>

        </div>

        <Link
          href="/batch_prediction"
          className="batch-btn"
        >
          Batch Prediction
        </Link>
      </div>
    </section>
  );
}