import Groq from "groq-sdk";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "groq-sdk/resources/chat/completions";

let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured. Copy .env.example to .env.local and add your key.");
    }
    client = new Groq({ apiKey });
  }
  return client;
}

/** Llama 3.3 70B — supports tool calling on Groq */
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface AgentToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export function toGroqTools(tools: AgentToolDefinition[]): ChatCompletionTool[] {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

export type ToolExecutor = (
  name: string,
  args: Record<string, unknown>
) => string | Promise<string>;

export async function chatWithGroq(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number }
): Promise<string> {
  const groq = getGroqClient();
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function chatWithTools(
  systemPrompt: string,
  userMessage: string,
  toolDefs: AgentToolDefinition[],
  executeTool: ToolExecutor,
  options?: {
    maxTokens?: number;
    maxIterations?: number;
    onToolCall?: (name: string, args: Record<string, unknown>) => void;
  }
): Promise<string> {
  const groq = getGroqClient();
  const tools = toGroqTools(toolDefs);
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  const maxIterations = options?.maxIterations ?? 8;

  for (let i = 0; i < maxIterations; i++) {
    let response;
    try {
      response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        max_tokens: options?.maxTokens ?? 4096,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? "auto" : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("tool_use_failed") || message.includes("Failed to call a function")) {
        return chatWithGroq(systemPrompt, userMessage, { maxTokens: options?.maxTokens });
      }
      throw error;
    }

    const choice = response.choices[0]?.message;
    if (!choice) break;

    messages.push(choice);

    const toolCalls = choice.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      return choice.content ?? "";
    }

    for (const toolCall of toolCalls) {
      const fn = toolCall.function;
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(fn.arguments || "{}") as Record<string, unknown>;
      } catch {
        args = {};
      }

      options?.onToolCall?.(fn.name, args);
      const result = await executeTool(fn.name, args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return "";
}

export function extractJsonFromResponse<T>(text: string): T {
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlock) {
    return JSON.parse(jsonBlock[1]) as T;
  }

  const arrayMatch = text.match(/(\[[\s\S]*\])/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[1]) as T;
  }

  const objectMatch = text.match(/(\{[\s\S]*\})/);
  if (objectMatch) {
    return JSON.parse(objectMatch[1]) as T;
  }

  throw new Error("No JSON found in agent response");
}
