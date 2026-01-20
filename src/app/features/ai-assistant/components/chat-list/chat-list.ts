import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ChatMessage, UserMessage } from '../../model/assistant';
import { AssistantService } from '../../service/chat.service';
import { AiResponseCard } from './ai-response/ai-response.component';
import { TypingIndicator } from './typing-indicator/typing-indicator.component';
import { UserMessageCard } from './user-message/user-message.component';

@Component({
  selector: 'adm-chat-list',
  imports: [TypingIndicator, UserMessageCard, AiResponseCard],
  templateUrl: './chat-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatList {
  private readonly assistantService = inject(AssistantService);
  readonly messages = input<ChatMessage[]>([]);

  readonly loading = input<boolean>(false);

  handleMessageEdit(message: UserMessage) {}

  handleMessageRegenerate() {
    this.assistantService.regenerateLastMessage();
  }
}
