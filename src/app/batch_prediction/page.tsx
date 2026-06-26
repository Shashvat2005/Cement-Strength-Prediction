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
  const [plant, setPlant] = useState("ACI");

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

      console.log({
        raw_data: rawInput,
        plant,
      });

      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/batch_predict`,
        `http://localhost:8000/batch_predict`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            raw_data: rawInput,
            plant: plant,
          }),
        }
      );

      console.log(response);

      if (!response.ok) {
        console.log(await response.text());
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
              Copy and Paste the cement quality data altogether of single or several days
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

        {/* <div className="form-row form-row-2"> */}
          <div className="input-group">
            <div className = "label-row">
              <label className="field-label">
                Select Plant
              </label>
            </div>
            
            <select
              id={"Plant"}
              name={"Plant"}
              required
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className = 'select_plant'
            >
              <option value="ACI">Arabian Cement Industries, Abu Dhabi</option>
              <option value="ACF">Ajman Cement Factory, Ajman</option>
              <option value="SSCI">Star Super Cement Industries, Dubai</option>
              <option value="AGCC">Arabian Gulf Cement Company, Bahrain</option>
            </select>
          </div>
        {/* </div> */}

        <div className="batch-card">

          <div className="batch-card-header">
            <ClipboardPaste size={18} />
            <span>INPUT DATA</span>
          </div>

          <textarea
            placeholder="Copy and Paste Data from .xls file in the format: Date, Blaine,	Residue +90μ,	Residue +45μ,	LOI,	SO₃,	C₃S,	C₂S,	2 Days Strength,	7 Days Strength"
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
            {status.type === "loading"
              ? "Processing..."
              : "Click here to Generate 28 Days Cement Compressive Strength"}
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
            <th>Blaine, Cm²/g</th>
            <th>R+90μ, %</th>
            <th>R+45μ, %</th>
            <th>LOI, %</th>
            <th>SO₃, %</th>
            <th>C₃S, %</th>
            <th>C₂S, %</th>
            <th>2D, MPa</th>
            <th>7D, MPa</th>
            <th>28D, MPa</th>
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