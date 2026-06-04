import { booleanAttribute, Component, input, output } from '@angular/core';
import { ChatMessage, UserMessage } from '../../model/assistant';
import { AiResponseCard } from '../ai-response/ai-response';
import { TypingIndicator } from '../typing-indicator/typing-indicator';
import { UserMessageCard } from '../user-message/user-message';

@Component({
  selector: 'adm-chat-list',
  imports: [TypingIndicator, UserMessageCard, AiResponseCard],
  template: `
    <div role="log" aria-live="polite" aria-atomic="false" aria-label="Chat messages">
      @if (messages().length > 0) {
        <!-- Messages -->
        <div class="flex flex-col gap-4 px-4 py-8 sm:py-12">
          @for (message of messages(); track message.id) {
            @if (message.role === 'assistant') {
              <adm-ai-response
                [content]="message.content"
                [isStreaming]="message.status === 'streaming'"
                (regenerate)="handleMessageRegenerate()"
              />
            } @else if (message.role === 'user') {
              <adm-user-message [message]="message" (edit)="handleMessageEdit(message)" />
            }
          }

          <!-- Loading indicator -->
          @if (loading()) {
            <adm-typing-indicator />
          }
        </div>
      }
    </div>
  `,
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
