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
import {
  lucideCheck,
  lucideCopy,
  lucideRefreshCcw,
  lucideSparkle,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'adm-ai-response',
  templateUrl: './ai-response.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [HlmIconImports, HlmButtonImports],
  viewProviders: [
    provideIcons({ lucideSparkle, lucideRefreshCcw, lucideCheck, lucideCopy, lucideThumbsDown, lucideThumbsUp }),
  ],
  host: {
    '[attr.aria-live]': '"polite"',
    '[attr.aria-busy]': 'isStreaming()',
  },
})
export class AiResponseCard {
  private readonly _clipboard = inject(Clipboard);
  private readonly _platformId = inject(PLATFORM_ID);

  // ==========================================
  // Inputs
  // ==========================================

  /** The markdown content to display */
  readonly content = input.required<string>();

  /** Whether the content is currently streaming */
  readonly isStreaming = input<boolean>(false);

  // ==========================================
  // Outputs
  // ==========================================

  /** Emitted when copy button is clicked with full content */
  messageCopied = output<string>();

  /** Emitted when a code block is copied */
  codeBlockCopy = output<string>();

  /** Emitted when regenerate button is clicked */
  regenerate = output<void>();

  /** Emitted when thumbs up is clicked */
  thumbsUp = output<void>();

  /** Emitted when thumbs down is clicked */
  thumbsDown = output<void>();

  // ==========================================
  // State
  // ==========================================

  readonly isHovered = signal(false);

  readonly isFocused = signal(false);

  readonly copied = signal(false);

  // ==========================================
  // Event Handlers
  // ==========================================

  /** Handle copy from ResponseActions */
  handleCopy(): void {
    if (!isPlatformBrowser(this._platformId)) return;

    if (this.copied()) return;

    const success = this._clipboard.copy(this.content());

    if (success) {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    }
  }

  /** Handle code block copy from MarkdownRenderer */
  handleCodeBlockCopy(code: string): void {
    this.codeBlockCopy.emit(code);
  }

  /** Handle regenerate from ResponseActions */
  handleRegenerate(): void {
    this.regenerate.emit();
  }

  /** Handle thumbs up from ResponseActions */
  handleThumbsUp(): void {
    this.thumbsUp.emit();
  }

  /** Handle thumbs down from ResponseActions */
  handleThumbsDown(): void {
    this.thumbsDown.emit();
  }
}
