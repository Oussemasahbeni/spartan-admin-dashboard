import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { AssistantInput } from './assistant-input/assistant-input';
import { AssistantEmptyState } from './empty-state/empty-state';

@Component({
  selector: 'adm-ai-assistant',
  imports: [AssistantEmptyState, AssistantInput, TranslocoModule],
  templateUrl: './ai-assistant.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'ai-assistant', alias: 'aiAssistant' })],
})
export class AiAssistant {
  readonly conversation = signal<string[]>([]);

  readonly isEmpty = computed(() => this.conversation().length === 0);
  readonly isLoading = signal(false);

  readonly activeSuggestions = computed(() => {
    if (this.isLoading()) {
      return [];
    }
    return ['Tell me a joke', 'What is the weather today?', 'Give me a coding tip'];
  });

  handleSendMessage(message: string) {
    const updatedConversation = [...this.conversation(), message];
    this.conversation.set(updatedConversation);
    this.isLoading.set(true);
  }

  handlePromptSelect(prompt: string) {
    const updatedConversation = [...this.conversation(), prompt];
    this.conversation.set(updatedConversation);
  }
}
