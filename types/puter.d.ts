/**
 * @file app/types/puter.ts
 * @description Type definitions for the Puter.js SDK integration.
 * Defines the contract between the ApexResume UI and the Puter Cloud environment.
 */

/**
 * Represents a file or directory object within the Puter File System.
 */
export interface FSItem {
  id: string;
  uid: string;
  name: string;
  path: string;
  is_dir: boolean;
  parent_id: string;
  parent_uid: string;
  created: number;  // Unix timestamp
  modified: number; // Unix timestamp
  accessed: number; // Unix timestamp
  size: number | null; // Null for directories
  writable: boolean;
}

/**
 * Encapsulates authenticated user profile data from the Puter environment.
 */
export interface PuterUser {
  uuid: string;
  username: string;
}

/**
 * A standard Key-Value pair retrieved from Puter's persistent storage.
 */
export interface KVItem {
  key: string;
  value: string;
}

/**
 * Discriminated Union for multi-modal AI inputs.
 * Ensures that 'file' items have paths and 'text' items have strings.
 */
export type ChatMessageContent = 
  | { type: "text"; text: string; puter_path?: never }
  | { type: "file"; puter_path: string; text?: never };

/**
 * Represents a single exchange in a conversational AI context.
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

/**
 * Configuration parameters for the Puter AI synthesis engine.
 */
export interface PuterChatOptions {
  model?: "gpt-4o" | "claude-3-5-sonnet" | string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: { 
        type: "object"; 
        properties: Record<string, unknown>;
        required?: string[];
      };
    };
  }>;
}

/**
 * The standardized response envelope from the Puter AI Chat Service.
 * Used for auditing token usage and calculating analysis costs.
 */
export interface AIResponse {
  index: number;
  message: {
    role: string;
    content: string | ChatMessageContent[];
    refusal: string | null;
    annotations: unknown[];
  };
  logprobs: unknown | null;
  finish_reason: "stop" | "length" | "content_filter" | string;
  usage: Array<{
    type: string;
    model: string;
    amount: number; // Total tokens
    cost: number;   // USD cost
  }>;
  via_ai_chat_service: boolean;
}