import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AssistantInput } from './components/assistant-input/assistant-input';
import { ChatList } from './components/chat-list/chat-list';
import { AssistantEmptyState } from './components/empty-state/empty-state';
import { AssistantService } from './service/chat.service';

@Component({
  selector: 'adm-ai-assistant',
  imports: [AssistantEmptyState, AssistantInput, TranslocoModule, ChatList, HlmScrollAreaImports, NgScrollbarModule],
  templateUrl: './ai-assistant.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistant {
  // ==========================================
  // Services
  // ==========================================

  private readonly _assistantService = inject(AssistantService);

  // ==========================================
  // State
  // ==========================================

  readonly conversation = this._assistantService.conversation;

  readonly messages = this._assistantService.messages;

  readonly isEmpty = computed(() => this.messages().length === 0);
  readonly isLoading = this._assistantService.isLoading;
  readonly isStreaming = this._assistantService.isStreaming;

  readonly activeSuggestions = computed(() => {
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
}
