import { Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AssistantInput } from '../components/assistant-input/assistant-input';
import { ChatList } from '../components/chat-list/chat-list';
import { AssistantEmptyState } from '../components/empty-state/empty-state';
import { AssistantService } from '../service/chat-service';

@Component({
  selector: 'adm-ai-assistant',
  imports: [AssistantEmptyState, AssistantInput, TranslocoModule, ChatList],
  template: `
    <div class="mx-auto flex h-[calc(100vh-120px)] w-full max-w-4xl flex-col">
      <div class="scroll-fade no-scrollbar flex-1 overflow-y-auto p-4">
        @if (isEmpty()) {
          <div class="flex min-h-full items-center justify-center">
            <div class="mx-auto w-full max-w-3xl">
              <adm-assistant-empty-state (promptSelect)="handleSendMessage($event)" />
            </div>
          </div>
        } @else {
          <div class="mx-auto w-full max-w-3xl">
            <adm-chat-list
              [loading]="isLoading()"
              [messages]="messages()"
              (regenerateLastMessage)="handleMessageRegenerate()"
            />
          </div>
        }
      </div>

      <div class="bg-background shrink-0">
        <div class="mx-auto w-full max-w-3xl">
          <adm-assistant-input
            [isLoading]="isLoading()"
            [isStreaming]="isStreaming()"
            [suggestions]="activeSuggestions()"
            (messageSend)="handleSendMessage($event)"
            (streamingStopped)="handleStopStreaming()"
          />
        </div>
      </div>
    </div>
  `,
})
export default class AiAssistant {
  // ==========================================
  // Services
  // ==========================================

  private readonly _assistantService = inject(AssistantService);

  // ==========================================
  // State
  // ==========================================

  protected readonly messages = this._assistantService.messages;
  protected readonly isEmpty = computed(() => this.messages().length === 0);
  protected readonly isLoading = this._assistantService.isLoading;
  protected readonly isStreaming = this._assistantService.isStreaming;

  protected readonly activeSuggestions = computed(() => {
    if (this.isLoading()) {
      return [];
    }
    return ['Tell me a joke', 'What is the weather today?', 'Give me a coding tip'];
  });

  // ==========================================
  // Public Methods
  // ==========================================

  handleSendMessage(prompt: string) {
    this._assistantService.sendMessage(prompt);
  }

  handleStopStreaming() {
    this._assistantService.stopStreaming();
  }

  handleMessageRegenerate() {
    this._assistantService.regenerateLastMessage();
  }
}
