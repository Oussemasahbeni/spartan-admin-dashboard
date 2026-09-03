import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, inject, input, output, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucidePencil, lucideUser } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { UserMessage } from '../../model/assistant';
import { EditEvent } from '../../model/user-message';

@Component({
  selector: 'adm-user-message',
  imports: [
    HlmTextareaImports,
    HlmInputGroupImports,
    HlmButtonImports,
    HlmMessageImports,
    HlmBubbleImports,
    TranslocoDirective,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideUser, lucideCopy, lucideCheck, lucidePencil })],
  template: `
    <article class="group flex min-w-0 flex-1 flex-col items-end" role="article">
      <!-- Message Card -->
      @if (isEditing()) {
        <div hlmInputGroup>
          <textarea
            hlmInputGroupTextarea
            [value]="editContent()"
            (input)="handleEditInput($event)"
            (keydown)="handleEditKeydown($event)"
          ></textarea>
          <div hlmInputGroupAddon align="block-end">
            <div *transloco="let t; prefix: 'buttons'" class="ms-auto flex items-center gap-4">
              <button type="button" hlmInputGroupButton size="sm" variant="secondary" (click)="cancelEdit()">
                <span>{{ t('cancel') }}</span>
              </button>
              <button type="button" hlmInputGroupButton size="sm" variant="default" (click)="saveEdit()">
                <span>{{ t('save') }}</span>
              </button>
            </div>
          </div>
        </div>
      } @else {
        <hlm-message align="end">
          <hlm-message-content>
            <hlm-bubble variant="muted">
              <hlm-bubble-content>{{ message().content }}.</hlm-bubble-content>
            </hlm-bubble>
            <hlm-message-footer
              *transloco="let t; prefix: 'aiAssistant.ariaLabels'"
              class="md:opacity-0 md:transition-opacity md:duration-200 md:ease-in-out md:group-focus-within:opacity-100 md:group-hover:opacity-100"
            >
              <span class="sr-only" role="status">{{ copied() ? t('copied') : '' }}</span>
              <button type="button" hlmBtn size="icon" variant="ghost" class="size-8" (click)="handleCopy()">
                <span class="sr-only">{{ t('copyMessage') }}</span>
                @if (copied()) {
                  <ng-icon name="lucideCheck" />
                } @else {
                  <ng-icon name="lucideCopy" />
                }
              </button>

              <button type="button" hlmBtn size="icon" variant="ghost" class="size-8" (click)="startEdit()">
                <span class="sr-only">{{ t('editMessage') }}</span>
                <ng-icon name="lucidePencil" />
              </button>
            </hlm-message-footer>
          </hlm-message-content>
        </hlm-message>
      }
    </article>
  `,
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
      this._copiedResetTimer = setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    }
  }

  private _copiedResetTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this._copiedResetTimer));
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
