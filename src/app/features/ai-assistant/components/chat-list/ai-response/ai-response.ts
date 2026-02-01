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

import { AiMarkdownRenderer } from './ai-markdown-renderer';

@Component({
  selector: 'adm-ai-response',
  templateUrl: './ai-response.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [HlmIconImports, HlmButtonImports, AiMarkdownRenderer],
  viewProviders: [
    provideIcons({ lucideSparkle, lucideRefreshCcw, lucideCheck, lucideCopy, lucideThumbsDown, lucideThumbsUp }),
  ],
  host: {
    '[attr.aria-live]': '"polite"',
    '[attr.aria-busy]': 'isStreaming()',
  },
})
export class AiResponseCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _clipboard = inject(Clipboard);
  private readonly _platformId = inject(PLATFORM_ID);

  // ==========================================
  // Inputs
  // ==========================================

  readonly content = input.required<string>();

  readonly isStreaming = input<boolean>(false);

  // ==========================================
  // Outputs
  // ==========================================

  /** Emitted when copy button is clicked with full content */
  readonly messageCopied = output<string>();

  /** Emitted when a code block is copied */
  readonly codeBlockCopy = output<string>();

  /** Emitted when regenerate button is clicked */
  readonly regenerate = output<void>();

  /** Emitted when thumbs up is clicked */
  readonly thumbsUp = output<void>();

  /** Emitted when thumbs down is clicked */
  readonly thumbsDown = output<void>();

  // ==========================================
  // State
  // ==========================================

  readonly copied = signal(false);

  // ==========================================
  // Public Methods
  // ==========================================

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

  handleCodeBlockCopy(code: string): void {
    this.codeBlockCopy.emit(code);
  }

  handleRegenerate(): void {
    this.regenerate.emit();
  }

  handleThumbsUp(): void {
    this.thumbsUp.emit();
  }

  handleThumbsDown(): void {
    this.thumbsDown.emit();
  }
}
