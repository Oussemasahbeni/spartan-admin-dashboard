import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
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
  providers: [provideTranslocoScope({ scope: 'ai-assistant', alias: 'aiAssistant' })],
})
export class AiAssistant {
  private readonly _assistantService = inject(AssistantService);

  readonly conversation = this._assistantService.activeConversation;

  readonly messages = this._assistantService.messages;

  readonly isEmpty = computed(() => this.messages().length === 0);
  readonly isLoading = this._assistantService.isLoading;

  readonly activeSuggestions = computed(() => {
    if (this.isLoading()) {
      return [];
    }
    return ['Tell me a joke', 'What is the weather today?', 'Give me a coding tip'];
  });

  handleSendMessage(prompt: string) {
    this._assistantService.sendMessage(prompt);

    // const updatedConversation = [...this.conversation(), prompt];
    // this.conversation.set(updatedConversation);

    // const chatMessage: ChatMessage = {
    //   id: crypto.randomUUID(),
    //   role: 'user',
    //   content: prompt,
    //   timestamp: new Date(),
    // };
    // this.messages.set([...this.messages(), chatMessage]);
    // this.isLoading.set(true);
  }
}
