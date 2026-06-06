interface ResultCardProps {
  strength?: number | null;
}

export default function ResultCard({
  strength = null,
}: ResultCardProps) {
  return (
    <div className="prediction-card">
      <div className="prediction-label">
        Predicted 28-Day Strength
      </div>

      <div className="prediction-value">
        {strength !== null
          ? strength.toFixed(2)
          : "--"}
      </div>

      <div className="prediction-unit">
        MPa
      </div>
    </div>
  );
}