'use client';

import { useState } from 'react';
import { predict } from '@/lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

export default function PredictionForm({
  setPrediction,
}: PredictionFormProps) {
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [formData, setFormData] =
    useState<FormData>({
      date: '',
      plant: '',
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

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

      const data = await predict(formData);

      setPrediction(
        data.predicted_strength
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['plant', 'Plant ID', 'number'],
    ['blaine', 'Blaine', 'number'],
    ['residue90', 'Residue 90', 'number'],
    ['residue45', 'Residue 45', 'number'],
    ['loi', 'L0I', 'number'],
    ['so3', 'SO3', 'number'],
    ['c3s', 'C3S', 'number'],
    ['c2s', 'C2S', 'number'],
    ['twoDays', '2 Days', 'number'],
    ['sevenDays', '7 Days', 'number'],
  ];

  return (
    <div className="main-card">
      <div className="card-header">
        INPUT PARAMETERS
      </div>

      <form
        onSubmit={handlePredict}
        className="form-grid"
      >
        <div className="input-group">
          <label>Date</label>

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
          />
        </div>

        {fields.map(
          ([name, label, type]) => (
            <div
              key={name}
              className="input-group"
            >
              <label>{label}</label>

              <input
                name={name}
                type={type}
                step="any"
                required
                value={
                  formData[
                    name as keyof FormData
                  ]
                }
                onChange={
                  handleInputChange
                }
              />
            </div>
          )
        )}

        <button
          type="submit"
          className="predict-btn"
          disabled={loading}
        >
          {loading
            ? 'Predicting...'
            : 'Predict Strength'}
        </button>
      </form>
    </div>
  );
}