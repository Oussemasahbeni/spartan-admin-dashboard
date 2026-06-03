import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChatMessage, UserMessage } from '../../model/assistant';
import { AiResponseCard } from './ai-response/ai-response';
import { TypingIndicator } from './typing-indicator/typing-indicator';
import { UserMessageCard } from './user-message/user-message';

@Component({
  selector: 'adm-chat-list',
  imports: [TypingIndicator, UserMessageCard, AiResponseCard],
  templateUrl: './chat-list.html',
})
export class ChatList {
  public readonly regenerateLastMessage = output<void>();
  // ==========================================
  // Inputs
  // ==========================================

  public readonly messages = input<ChatMessage[]>([]);
  public readonly loading = input(false, { transform: booleanAttribute });

  // ==========================================
  // Public Methods
  // ==========================================

  handleMessageEdit(_message: UserMessage) {}

  handleMessageRegenerate() {
    this.regenerateLastMessage.emit();
  }
}
