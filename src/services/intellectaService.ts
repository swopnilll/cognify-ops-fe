import { fetchWithAuth } from "./fetchWithAuth";

// The AI is off unless the app is built with VITE_AI_ENABLED=true. While it is
// off, Intellecta makes no API calls and replies with a fixed message.
export const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === "true";

interface StreamMessage {
  type: "message" | "final" | "end" | "error";
  data?: string;
  error?: string;
}

export const streamOpenAIResponse = async (
  question: string,
  onChunk: (chunk: string) => void,
  onComplete?: (finalOutput: string) => void,
  onError?: (error: any) => void
): Promise<void> => {
  try {
    let finalOutput = "";
    const response = await fetchWithAuth("/api/openai/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    if (!response.body)
      throw new Error("No response body returned from server.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      if (value) {
        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const jsonData = line.replace(/^data:\s*/, "");

          try {
            const event: StreamMessage = JSON.parse(jsonData);

            switch (event.type) {
              case "message":
                if (event.data) {
                  console.log("🗨️ Streaming chunk:", event.data);
                  onChunk(event.data);
                  finalOutput += event.data;
                }
                break;

              case "final":
                if (event.data) {
                  finalOutput = event.data;
                  onComplete?.(finalOutput);
                  console.log("✅ Final output:", finalOutput);
                }
                break;

              case "end":
                console.log("✅ Streaming complete");
                break;

              case "error":
                console.error("❌ Server stream error:", event.error);
                onError?.(event.error);
                break;

              default:
                console.warn("⚠️ Unknown event type:", event.type);
                break;
            }
          } catch (err) {
            console.warn("⚠️ Failed to parse stream chunk as JSON:", jsonData);
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    onError?.(err);
  }
};

export async function getContextBasedResponse(query: string): Promise<string> {
  const apiResponse = await fetchWithAuth("/api/openai/askIntellecta", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  if (!apiResponse.ok) {
    throw new Error("Failed to fetch response from askIntellecta");
  }

  const json = await apiResponse.json();
  const cleanedResponse = json.response.replace(/\\"/g, '"');

  return cleanedResponse;
}
