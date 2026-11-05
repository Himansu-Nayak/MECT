import Groq from "groq-sdk";
import { buildSystemPrompt } from "./mect-knowledge";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChatOptions {
  messages: ChatMessage[];
  preferredLanguage?: "en" | "or" | "hi";
  temperature?: number;
  maxTokens?: number;
}

// Global cached client instance
let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured in server environment. Please set GROQ_API_KEY in .env.local"
    );
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
}

export const PRIMARY_GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
export const FALLBACK_GROQ_MODEL = "openai/gpt-oss-20b";

/**
 * Creates a streaming chat completion stream from Groq
 */
export async function createGroqChatStream({
  messages,
  preferredLanguage = "en",
  temperature = 0.5,
  maxTokens = 1024,
}: StreamChatOptions) {
  const client = getGroqClient();

  const systemMessage: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(preferredLanguage),
  };

  // Keep recent turns to prevent context explosion while preserving context
  const trimmedHistory = messages.slice(-8);

  const fullMessages: ChatMessage[] = [systemMessage, ...trimmedHistory];

  try {
    return await client.chat.completions.create({
      model: PRIMARY_GROQ_MODEL,
      messages: fullMessages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    console.warn(`[Groq Primary Model Error]:`, err?.message || err);

    // If primary model failed (e.g. rate limit or model error), attempt fallback
    if (PRIMARY_GROQ_MODEL !== FALLBACK_GROQ_MODEL) {
      console.info(`[Groq] Falling back to: ${FALLBACK_GROQ_MODEL}`);
      return await client.chat.completions.create({
        model: FALLBACK_GROQ_MODEL,
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });
    }

    throw error;
  }
}

