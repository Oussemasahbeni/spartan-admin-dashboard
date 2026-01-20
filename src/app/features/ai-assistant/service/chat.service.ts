import { Injectable, computed, signal } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class AssistantService {
  // State
  private readonly conversationsSignal = signal<Conversation[]>([]);
  private readonly activeConversationIdSignal = signal<string | null>(null);
  private readonly isLoadingSignal = signal(false);

  // Public computed signals
  readonly conversations = this.conversationsSignal.asReadonly();
  readonly activeConversationId = this.activeConversationIdSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Get the active conversation
   */
  readonly activeConversation = computed(() => {
    const id = this.activeConversationIdSignal();
    if (!id) return null;
    return this.conversationsSignal().find((c) => c.id === id) ?? null;
  });

  /**
   * Get messages for the active conversation
   */
  readonly messages = computed(() => {
    return this.activeConversation()?.messages ?? [];
  });

  /**
   * Check if current conversation is empty (no messages)
   */
  readonly isEmptyConversation = computed(() => {
    return this.messages().length === 0;
  });

  /**
   * Create a new conversation
   */
  createConversation(): string {
    const id = this.generateId();
    const now = new Date();

    const newConversation: Conversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this.conversationsSignal.update((convos) => [newConversation, ...convos]);
    this.activeConversationIdSignal.set(id);

    return id;
  }

  /**
   * Select a conversation by ID
   */
  selectConversation(id: string): void {
    const exists = this.conversationsSignal().some((c) => c.id === id);
    if (exists) {
      this.activeConversationIdSignal.set(id);
    }
  }

  /**
   * Send a user message and get a simulated AI response with streaming
   */
  async sendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    let conversationId = this.activeConversationIdSignal();

    // Create new conversation if none active
    if (!conversationId) {
      conversationId = this.createConversation();
    }

    const now = new Date();

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: now,
    };

    this.addMessageToConversation(conversationId, userMessage);

    // Update conversation title if this is the first message
    const conversation = this.conversationsSignal().find((c) => c.id === conversationId);
    if (conversation && conversation.messages.length === 1) {
      this.updateConversationTitle(conversationId, this.generateTitle(content));
    }

    // Simulate AI response with streaming
    this.isLoadingSignal.set(true);

    // Short delay before AI starts responding
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fullResponse = this.getRandomResponse();
    const aiMessageId = this.generateId();

    // Add streaming message with empty content
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    };

    this.addMessageToConversation(conversationId, aiMessage);
    this.isLoadingSignal.set(false);

    // Stream the response character by character
    await this.streamResponse(conversationId, aiMessageId, fullResponse);
  }

  /**
   * Stream response content character by character
   */
  private async streamResponse(conversationId: string, messageId: string, fullContent: string): Promise<void> {
    const chunkSize = 3; // Characters per chunk
    const delayMs = 15; // Delay between chunks

    for (let i = 0; i < fullContent.length; i += chunkSize) {
      const partialContent = fullContent.slice(0, i + chunkSize);

      this.updateMessageContent(conversationId, messageId, partialContent, 'streaming');

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    // Mark streaming complete
    this.updateMessageContent(conversationId, messageId, fullContent, undefined);
  }

  /**
   * Update a message's content and status
   */
  private updateMessageContent(
    conversationId: string,
    messageId: string,
    content: string,
    status: MessageStatus | undefined
  ): void {
    this.conversationsSignal.update((convos) =>
      convos.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m;
            return { ...m, content, status };
          }),
          updatedAt: new Date(),
        };
      })
    );
  }

  /**
   * Regenerate the last assistant message with streaming
   */
  async regenerateLastMessage(): Promise<void> {
    const conversation = this.activeConversation();
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
    this.conversationsSignal.update((convos) =>
      convos.map((c) => {
        if (c.id !== conversation.id) return c;
        return {
          ...c,
          messages: c.messages.filter((_, i) => i !== lastAssistantIndex),
          updatedAt: new Date(),
        };
      })
    );

    // Generate new response with streaming
    this.isLoadingSignal.set(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fullResponse = this.getRandomResponse();
    const aiMessageId = this.generateId();

    // Add streaming message
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    };

    this.addMessageToConversation(conversation.id, aiMessage);
    this.isLoadingSignal.set(false);

    // Stream the response
    await this.streamResponse(conversation.id, aiMessageId, fullResponse);
  }

  /**
   * Clear all conversations
   */
  clearAllConversations(): void {
    this.conversationsSignal.set([]);
    this.activeConversationIdSignal.set(null);
  }

  // Private methods

  private addMessageToConversation(conversationId: string, message: ChatMessage): void {
    this.conversationsSignal.update((convos) =>
      convos.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: [...c.messages, message],
          updatedAt: new Date(),
        };
      })
    );
  }

  private updateConversationTitle(id: string, title: string): void {
    this.conversationsSignal.update((convos) =>
      convos.map((c) => {
        if (c.id !== id) return c;
        return { ...c, title };
      })
    );
  }

  private generateTitle(content: string): string {
    // Use first 50 chars of message as title
    const truncated = content.slice(0, 50);
    return truncated.length < content.length ? `${truncated}...` : truncated;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  private getRandomResponse(): string {
    const index = Math.floor(Math.random() * AI_RESPONSES.length);
    return AI_RESPONSES[index];
  }
}
