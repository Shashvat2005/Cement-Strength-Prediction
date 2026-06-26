export async function predict(
  payload: unknown
) {
  process.env.NEXT_PUBLIC_API_URL;
  // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const API_URL = "http://localhost:8000";
  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Prediction failed"
    );
  }
  console.log(response);
  return response.json();
}