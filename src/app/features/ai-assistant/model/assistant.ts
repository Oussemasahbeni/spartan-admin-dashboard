export type ChatRole = 'user' | 'assistant' | 'system';

/**
 * Message status
 */
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'streaming';

/**
 * Base message interface
 */
export interface BaseMessage {
  id: string;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
}

/**
 * User message
 */
export interface UserMessage extends BaseMessage {
  role: 'user';
  attachments?: File[];
}

/**
 * Assistant message
 */
export interface AssistantMessage extends BaseMessage {
  role: 'assistant';
  model?: string;
  tokenCount?: number;
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls';
}

/**
 * System message
 */
export interface SystemMessage extends BaseMessage {
  role: 'system';
  priority?: 'low' | 'normal' | 'high';
}

/**
 * Discriminated union of all message types
 */
export type ChatMessage = UserMessage | AssistantMessage | SystemMessage;

/**
 * Message metadata
 */
export interface MessageMetadata {
  conversationId?: string;
  parentMessageId?: string;
  edited?: boolean;
  editedAt?: Date;
  retryCount?: number;
}

/**
 * Extended chat message with metadata
 */
export type ExtendedChatMessage = ChatMessage & {
  metadata?: MessageMetadata;
};

/**
 * Type guard for user message
 */
export function isUserMessage(message: ChatMessage): message is UserMessage {
  return message.role === 'user';
}

/**
 * Type guard for assistant message
 */
export function isAssistantMessage(message: ChatMessage): message is AssistantMessage {
  return message.role === 'assistant';
}

/**
 * Type guard for system message
 */
export function isSystemMessage(message: ChatMessage): message is SystemMessage {
  return message.role === 'system';
}
