import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucidePencil, lucideUser } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { UserMessage } from '../../../model/assistant';
import { EditEvent } from '../../../model/user-message';

@Component({
  selector: 'adm-user-message',
  templateUrl: './user-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmTextareaImports, HlmInputGroupImports, HlmButtonImports, HlmIconImports],
  viewProviders: [provideIcons({ lucideUser, lucideCopy, lucideCheck, lucidePencil })],
})
export class UserMessageCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _clipboard = inject(Clipboard);
  private readonly _platformId = inject(PLATFORM_ID);

  // ==========================================
  // Inputs
  // ==========================================

  /** The user message to display */
  public readonly message = input.required<UserMessage>();

  // ==========================================
  // Outputs
  // ==========================================

  /** Emitted when message is edited and saved */
  public readonly edit = output<EditEvent>();

  // ==========================================
  // State
  // ==========================================

  public readonly isEditing = signal(false);
  public readonly editContent = signal('');
  public readonly copied = signal(false);

  // ==========================================
  // Public Methods
  // ==========================================

  /** Handle copy from MessageActions */
  handleCopy(): void {
    if (!isPlatformBrowser(this._platformId)) return;

    if (this.copied()) return;

    const success = this._clipboard.copy(this.message().content);

    if (success) {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    }
  }

  /** Start editing mode */
  startEdit(): void {
    this.editContent.set(this.message().content);
    this.isEditing.set(true);
  }

  /** Cancel editing */
  cancelEdit(): void {
    this.isEditing.set(false);
    this.editContent.set('');
  }

  /** Save edited content */
  saveEdit(): void {
    const newContent = this.editContent().trim();
    const originalContent = this.message().content;

    if (newContent && newContent !== originalContent) {
      this.edit.emit({
        originalContent,
        newContent,
      });
    }
    this.isEditing.set(false);
    this.editContent.set('');
  }

  /** Handle textarea input */
  handleEditInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.editContent.set(target.value);
  }

  /** Handle keyboard events in edit mode */
  handleEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.saveEdit();
    }
  }
}
