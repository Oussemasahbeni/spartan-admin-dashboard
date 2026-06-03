import { Injectable, Service, computed, signal } from '@angular/core';
import { ChatMessage, MessageStatus } from '../model/assistant';
import { AI_RESPONSES } from './data';

/**
 * Conversation interface for chat history
 */
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

@Service()
export class AssistantService {
  private readonly conversationSignal = signal<Conversation | null>(null);
  private readonly isLoadingSignal = signal(false);
  private streamAbortController: AbortController | null = null;

  public readonly conversation = this.conversationSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Get messages for the active conversation
   */
  public readonly messages = computed(() => {
    return this.conversation()?.messages ?? [];
  });

  /**
   * Check if current conversation is empty (no messages)
   */
  public readonly isEmptyConversation = computed(() => {
    return this.messages().length === 0;
  });

  /**
   * Check if the last message is currently streaming
   */
  public readonly isStreaming = computed(() => {
    const msgs = this.messages();
    if (msgs.length === 0) return false;
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg.status === 'streaming';
  });

  /**
   * Create a new conversation
   */
  createConversation(): string {
    const id = crypto.randomUUID();
    const now = new Date();

    const newConversation: Conversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this.conversationSignal.set(newConversation);

    return id;
  }

  /**
   * Send a user message and get a simulated AI response with streaming
   */
  async sendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    if (!this.conversationSignal()) {
      this.createConversation();
    }

    const now = new Date();

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: now,
    };

    this.addMessageToConversation(userMessage);

    // Simulate AI response with streaming
    this.isLoadingSignal.set(true);

    // Short delay before AI starts responding
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fullResponse = this.getRandomResponse();

    // Add streaming message with empty content
    const aiMessageId = crypto.randomUUID();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    };

    this.addMessageToConversation(aiMessage);
    this.isLoadingSignal.set(false);

    // Stream the response character by character
    await this.streamResponse(aiMessageId, fullResponse);
  }

  /**
   * Stream response content character by character
   */
  private async streamResponse(messageId: string, fullContent: string): Promise<void> {
    const chunkSize = 3; // Characters per chunk
    const delayMs = 15; // Delay between chunks

    // Create abort controller for this stream
    this.streamAbortController = new AbortController();
    const signal = this.streamAbortController.signal;

    try {
      for (let i = 0; i < fullContent.length; i += chunkSize) {
        // Check if streaming was aborted
        if (signal.aborted) {
          return;
        }

        const partialContent = fullContent.slice(0, i + chunkSize);
        this.updateMessageContent(messageId, partialContent, 'streaming');

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      // Mark streaming complete
      this.updateMessageContent(messageId, fullContent, undefined);
    } finally {
      this.streamAbortController = null;
    }
  }

  /**
   * Update a message's content and status
   */
  private updateMessageContent(messageId: string, content: string, status: MessageStatus | undefined): void {
    this.conversationSignal.update((conversation) => {
      if (conversation === null) return conversation;
      return {
        ...conversation,
        messages: conversation.messages.map((m) => {
          if (m.id !== messageId) return m;
          return { ...m, content, status };
        }),
        updatedAt: new Date(),
      };
    });
  }

  /**
   * Stop the current streaming response
   */
  stopStreaming(): void {
    if (this.streamAbortController) {
      this.streamAbortController.abort();
      this.streamAbortController = null;

      // Mark the last streaming message as complete
      if (!this.conversationSignal()) return;

      const streamingMsg = this.conversationSignal()?.messages.find((m) => m.status === 'streaming');
      if (streamingMsg) {
        this.updateMessageContent(streamingMsg.id, streamingMsg.content, undefined);
      }
    }
  }

  /**
   * Regenerate the last assistant message with streaming
   */
  async regenerateLastMessage(): Promise<void> {
    const conversation = this.conversationSignal();
    if (!conversation) return;

    const messages = conversation.messages;
    if (messages.length === 0) return;

    // Find and remove the last assistant message
    const lastAssistantIndex = messages
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.role === 'assistant')
      .pop()?.i;

    if (lastAssistantIndex === undefined) return;

    // Remove the last assistant message
    this.conversationSignal.update((conversation) => {
      if (conversation === null) return conversation;
      return {
        ...conversation,
        messages: conversation.messages.filter((_, i) => i !== lastAssistantIndex),
        updatedAt: new Date(),
      };
    });

    // Generate new response with streaming
    this.isLoadingSignal.set(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fullResponse = this.getRandomResponse();

    // Add streaming message
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    };

    this.addMessageToConversation(aiMessage);
    this.isLoadingSignal.set(false);

    // Stream the response
    await this.streamResponse(aiMessage.id, fullResponse);
  }

  // Private methods

  private addMessageToConversation(message: ChatMessage): void {
    this.conversationSignal.update((conversation) => {
      if (conversation === null) return conversation;
      return {
        ...conversation,
        messages: [...conversation.messages, message],
        updatedAt: new Date(),
      };
    });
  }

  private getRandomResponse(): string {
    const index = Math.floor(Math.random() * AI_RESPONSES.length);
    return AI_RESPONSES[index];
  }
}
