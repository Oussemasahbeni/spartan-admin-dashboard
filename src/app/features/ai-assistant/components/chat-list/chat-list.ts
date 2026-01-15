import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ChatMessage } from '../../model/assistant';
import { TypingIndicatorComponent } from "./typing-indicator/typing-indicator.component";

@Component({
  selector: 'adm-chat-list',
  imports: [TypingIndicatorComponent],
  templateUrl: './chat-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatList {
  readonly messages = signal<ChatMessage[]>([]);

  readonly loading = input<boolean>(false);
}
