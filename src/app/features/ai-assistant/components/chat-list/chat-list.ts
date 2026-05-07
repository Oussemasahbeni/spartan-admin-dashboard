import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ChatMessage, UserMessage } from '../../model/assistant';
import { AssistantService } from '../../service/chat.service';
import { AiResponseCard } from './ai-response/ai-response';
import { TypingIndicator } from './typing-indicator/typing-indicator';
import { UserMessageCard } from './user-message/user-message';

@Component({
  selector: 'adm-chat-list',
  imports: [TypingIndicator, UserMessageCard, AiResponseCard],
  templateUrl: './chat-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatList {
  // ==========================================
  // Services
  // ==========================================

  private readonly assistantService = inject(AssistantService);

  // ==========================================
  // Inputs
  // ==========================================

  public readonly messages = input<ChatMessage[]>([]);
  public readonly loading = input<boolean>(false);

  // ==========================================
  // Public Methods
  // ==========================================

  handleMessageEdit(_message: UserMessage) {}

  handleMessageRegenerate() {
    this.assistantService.regenerateLastMessage();
  }
}
