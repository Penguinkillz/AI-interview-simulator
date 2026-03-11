import "server-only";

interface CallLLMOptions {
  systemPrompt?: string;
  maxTokens?: number;
  jsonMode?: boolean;
}

const LLM_BASE_URL =
  process.env.LLM_API_BASE_URL || "https://api.groq.com/openai/v1";
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL =
  process.env.LLM_MODEL || "llama-3.3-70b-versatile";

export async function callLLM(
  userPrompt: string,
  options: CallLLMOptions = {}
): Promise<string> {
  if (!LLM_API_KEY) {
    // Fallback to a cheap mock so the app still works without configuration.
    return JSON.stringify({
      mock: true,
      message:
        "LLM_API_KEY is not set. This is a mock response from the server. Configure a real LLM provider to get real evaluations.",
    });
  }

  const body = {
    model: LLM_MODEL,
    messages: [
      options.systemPrompt
        ? { role: "system", content: options.systemPrompt }
        : null,
      { role: "user", content: userPrompt },
    ].filter(Boolean),
    max_tokens: options.maxTokens ?? 800,
    temperature: 0.4,
    ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
  };

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `LLM request failed with status ${res.status}: ${text || res.statusText}`
    );
  }

  const json = (await res.json()) as any;
  const content: string | undefined =
    json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text;

  if (!content) {
    throw new Error("LLM response did not contain content");
  }

  return content.trim();
}

