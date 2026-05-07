import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AssistantService } from '../service/chat.service';
import { AssistantInput } from './assistant-input/assistant-input';
import { ChatList } from './chat-list/chat-list';
import { AssistantEmptyState } from './empty-state/empty-state';

@Component({
  selector: 'adm-ai-assistant',
  imports: [AssistantEmptyState, AssistantInput, TranslocoModule, ChatList, HlmScrollAreaImports, NgScrollbarModule],
  templateUrl: './ai-assistant.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AiAssistant {
  // ==========================================
  // Services
  // ==========================================

  private readonly _assistantService = inject(AssistantService);

  // ==========================================
  // State
  // ==========================================

  protected readonly conversation = this._assistantService.conversation;

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
}
