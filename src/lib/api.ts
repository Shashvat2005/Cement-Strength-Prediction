export async function predict(
  payload: unknown
) {
  const API_URL =
  process.env.NEXT_PUBLIC_API_URL;
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

  return response.json();
}