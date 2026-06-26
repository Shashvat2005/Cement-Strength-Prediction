'use client';

import { useState } from 'react';
import { predict } from '@/lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays, Link } from 'lucide-react';

interface PredictionFormProps {
  setPrediction: (value: number) => void;
}

interface FormData {
  date: string;
  plant: string;
  blaine: string;
  residue90: string;
  residue45: string;
  loi: string;
  so3: string;
  c3s: string;
  c2s: string;
  twoDays: string;
  sevenDays: string;
}

interface FieldConfig {
  name: keyof FormData;
  label: string;
  type: string;
  unit?: string;
  isDate?: boolean;
}

export default function PredictionForm({
  setPrediction,
}: PredictionFormProps) {
  const [loading, setLoading] = useState(false);
  const [predictedStrength, setPredictedStrength] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [formData, setFormData] =
    useState<FormData>({
      date: '',
      plant: 'ACI',
      blaine: '',
      residue90: '',
      residue45: '',
      loi: '',
      so3: '',
      c3s: '',
      c2s: '',
      twoDays: '',
      sevenDays: '',
    });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
      date: Date | null
    ) => {
      setSelectedDate(date);

      setFormData((prev) => ({
        ...prev,
        date: date
          ? date.toISOString().split("T")[0]
          : "",
      }));
    };

  async function handlePredict(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        date: formData.date,
        plant: formData.plant,
        blaine: Number(formData.blaine),
        residue90: Number(formData.residue90),
        residue45: Number(formData.residue45),
        loi: Number(formData.loi),
        so3: Number(formData.so3),
        c3s: Number(formData.c3s),
        c2s: Number(formData.c2s),
        twoDays: Number(formData.twoDays),
        sevenDays: Number(formData.sevenDays),
      };
      // console.log(payload);
      const data = await predict(payload);
      // console.log(data);
      const nextPrediction = Number(data.prediction);
      setPrediction(nextPrediction);
      setPredictedStrength(nextPrediction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const rowOneFields: FieldConfig[] = [
    { name: 'date', label: 'Date', type: 'date', isDate: true },
    { name: 'plant', label: 'Plant', type: 'number' },
  ];

  const rowTwoFields: FieldConfig[] = [
    { name: 'blaine', label: 'Blaine', type: 'number', unit: 'Cm²/g' },
    { name: 'residue90', label: 'Residue +90μ', type: 'number', unit: '%' },
    { name: 'residue45', label: 'Residue +45μ', type: 'number', unit: '%' },
  ];

  const rowThreeFields: FieldConfig[] = [
    { name: 'loi', label: 'LOI', type: 'number', unit: '%' },
    { name: 'so3', label: 'SO₃', type: 'number', unit: '%' },
    { name: 'c2s', label: 'C₂S', type: 'number', unit: '%' },
    { name: 'c3s', label: 'C₃S', type: 'number', unit: '%' },
  ];

  const rowFourFields: FieldConfig[] = [
    { name: 'twoDays', label: '2 Days Strength', type: 'number', unit: 'MPa' },
    { name: 'sevenDays', label: '7 Days Strength', type: 'number', unit: 'MPa' },
    // { name: 'sevenDays', label: 'Click here to Generate 28 Days Cement Compressive Strength', type: 'number', unit: 'MPa' },
  ];

  return (
    <div>
      

    <div className="main-card">
      <div className="card-header">
        Single Date Result
      </div>

      <form onSubmit={handlePredict} className="form-grid">
        <div className="form-row form-row-2">
          {rowOneFields.map((field) => (
            <div key={field.name} className="input-group">
              <div className="label-row">
                <label htmlFor={field.name} className="field-label">
                  {field.label}
                  {!field.isDate && field.unit && <span className="field-unit">, {field.unit}</span>}
                </label>
              </div>

              {field.isDate ? (
                <div className="date-picker-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                    dropdownMode="select"
                    className="date-picker"
                    placeholderText="Select date"
                  />
                  <CalendarDays className="date-picker-icon" size={16} />
                </div>
              ) : field.name === 'plant' ? (
                <select
                  id={field.name}
                  name={field.name}
                  required
                  value={formData[field.name as keyof FormData]}
                  onChange={handleInputChange}
                  className = 'select_plant'
                >
                  <option value="ACI">Arabian Cement Industries, Abu Dhabi</option>
                  <option value="ACF">Ajman Cement Factory, Ajman</option>
                  <option value="SSCI">Star Super Cement Industries, Dubai</option>
                  <option value="AGCC">Arabian Gulf Cement Company, Bahrain</option>
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  step="any"
                  required
                  value={formData[field.name as keyof FormData]}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-row form-row-3">
          {rowTwoFields.map((field) => (
            <div key={field.name} className="input-group">
              <div className="label-row">
                <label htmlFor={field.name} className="field-label">
                  {field.label}
                  {field.unit && <span className="field-unit">, {field.unit}</span>}
                </label>
              </div>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                step="any"
                required
                value={formData[field.name as keyof FormData]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>

        <div className="form-row form-row-4">
          {rowThreeFields.map((field) => (
            <div key={field.name} className="input-group">
              <div className="label-row">
                <label htmlFor={field.name} className="field-label">
                  {field.label}
                  {field.unit && <span className="field-unit">, {field.unit}</span>}
                </label>
              </div>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                step="any"
                required
                value={formData[field.name as keyof FormData]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>

        <div className="form-row form-row-2-actions">
          {rowFourFields.map((field) => (
            <div key={field.name} className="input-group">
              <div className="label-row">
                <label htmlFor={field.name} className="field-label">
                  {field.label}
                  {field.unit && <span className="field-unit">, {field.unit}</span>}
                </label>
              </div>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                step="any"
                required
                value={formData[field.name as keyof FormData]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          {/* <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? 'Predicting...' : 'Predicted 28 Days Compressive Strength, MPa'}
          </button> */}
        </div>

        <div className='label-row'>
            <button
              type="submit"
              className="predict-trigger"
              disabled={loading}
            >
              Click here to Generate 28 Days Cement Compressive Strength, MPa
              {/* <span className='predict-trigger'>, MPa</span> */}
            </button>
        </div>

        <div className="prediction-display">
          <span className="prediction-value">
            {predictedStrength !== null
              ? `${predictedStrength.toFixed(2)} MPa`
              : loading
                ? 'Predicting...'
                : ''}
          </span>
        </div>

      </form>
    </div>
    {/* <Link
        href="/batch_prediction"
        className="batch-btn"
      >
        Multiple Dates Result
      </Link> */}
    </div>
  );
}