const primaryModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const fallbackModel = "gemini-2.5-flash-lite";

export const generateGeminiResponse = async (prompt) => {
  try {
    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 2048,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const requestModel = (model) =>
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
          signal: AbortSignal.timeout(25000),
        }
      );

    let response = await requestModel(primaryModel);

    if (!response.ok && [429, 500, 503].includes(response.status) && primaryModel !== fallbackModel) {
      console.warn(`Gemini ${primaryModel} returned ${response.status}; retrying with ${fallbackModel}.`);
      response = await requestModel(fallbackModel);
    }

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message = err?.error?.message || `Gemini request failed (${response.status})`;
      throw new Error(message);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textPart = parts.find((p) => typeof p.text === "string" && !p.thought) || parts[0];
    const text = textPart?.text;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw new Error(error.message || "Failed to generate response. Please try again later.");
  }
};