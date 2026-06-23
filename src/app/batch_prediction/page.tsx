'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { 
  ClipboardPaste,
  CloudLightning,
  ArrowLeft
} from 'lucide-react'
import { BatchPredictionResult } from "@/types/batch_prediction";
import Image from "next/image";


export default function BatchPredictPage() {
  const router = useRouter()

  const [rawInput, setRawInput] = useState("");

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({
    type: "idle",
  });

  const [results, setResults] =
  useState<BatchPredictionResult[]>([]);
  async function handleBatchPrediction() {
    if (!rawInput.trim()) return;

    try {
      setStatus({
        type: "loading",
        message: "Processing...",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/batch_predict`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            raw_data: rawInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Prediction failed"
        );
      }

      const data = await response.json();

      setResults(data.results);

      setStatus({
        type: "success",
        message: `${data.results.length} predictions generated`,
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          "Failed to process records",
      });
    }
  }
  return (
    <main className="dashboard">
      <div className="dashboard-container">

        <button
          onClick={() => router.back()}
          className="back-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
          <span style={{ marginLeft: 8 }}>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%' }}>
          
          
          <div className="hero">
            <h1 className="hero-title">Batch Prediction</h1>

            <p className='hero-content'>
              Paste rows copied from the
              Plant Performance Sheet
              and generate predictions instantly.
            </p>
          </div>

          {/* 2. The Small Image Container */}
          <div style={{ 
            position: 'relative', 
            width: '90px', 
            height: '90px', 
            flexShrink: 0 // Prevents the image from squishing
          }}>
            <Image 
              src="/ABG.jpeg" 
              alt="Hero" 
              fill
              style={{ objectFit: 'cover', borderRadius: '6px' }}
            />
          </div>

          
        </div>

        <div className="batch-card">

          <div className="batch-card-header">
            <ClipboardPaste size={18} />
            <span>INPUT DATA</span>
          </div>

          <textarea
            placeholder="Date, Plant,	Blaine,	Residue 90,	Residue 45,	L0I,	SO3,	C3S,	C2S,	2 Days Strength,	7 Days Strength"
            className="batch-input"
            value={rawInput}
            onChange={(e) =>
              setRawInput(e.target.value)
            }
          />

          <button
            onClick={handleBatchPrediction}
            disabled={status.type === "loading"}
            className="predict-btn"
          >
            <CloudLightning size={18} />

            {status.type === "loading"
              ? "Processing..."
              : "Generate Predictions"}
          </button>

        </div>

        {results.length > 0 && (
  <div className="results-card">

    <div className="results-header">
      Prediction Results ({results.length} Records)
    </div>

    <div className="table-wrapper">
      <table className="results-table">

        <thead>
          <tr>
            <th>Date</th>
            <th>Plant</th>
            <th>Blaine</th>
            <th>R90</th>
            <th>R45</th>
            <th>LOI</th>
            <th>SO3</th>
            <th>C3S</th>
            <th>C2S</th>
            <th>2D</th>
            <th>7D</th>
            <th>28D</th>
          </tr>
        </thead>

        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.plant}</td>
              <td>{row.blaine}</td>
              <td>{row.residue90}</td>
              <td>{row.residue45}</td>
              <td>{row.loi}</td>
              <td>{row.so3}</td>
              <td>{row.c3s}</td>
              <td>{row.c2s}</td>
              <td>{row.twoDays}</td>
              <td>{row.sevenDays}</td>

              <td className="prediction-cell">
                {Number(row.prediction).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

  </div>
)}
      
      </div>
    </main>
  );
}