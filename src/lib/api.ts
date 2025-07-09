import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY;

export const modelSearchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(1000, "Query too long (max 1000 characters)")
    .refine(
      (val) => !/ignore.*previous.*instructions|system.*prompt|role.*play|<script.*>|javascript:/i.test(val),
      { message: "Query contains potentially harmful content" }
    ),
});

export async function searchModels(query: string) {
  // Validate input
  const parseResult = modelSearchSchema.safeParse({ query });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/model_search`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: query.trim() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
} 