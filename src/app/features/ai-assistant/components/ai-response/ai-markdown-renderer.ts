import { Component, DestroyRef, effect, inject, injectAsync, input, onIdle, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'adm-ai-markdown-renderer',
  host: {
    ['class']: 'block',
    '(click)': 'onHostClick($event)',
  },
  template: `
    <div #contentArea class="prose dark:prose-invert prose-headings:text-base max-w-full">
      <span [innerHTML]="renderedHtml()"></span>
    </div>
  `,
})
export class AiMarkdownRenderer {
  // ==========================================
  // Services
  // ==========================================

  private sanitizer = inject(DomSanitizer);

  private readonly _copyResetTimers = new Set<ReturnType<typeof setTimeout>>();

  private rendererService = injectAsync(() => import('./markdown-renderer'), { prefetch: onIdle });

  // ==========================================
  // State
  // ==========================================

  /**
   * Rendered HTML from markdown.
   *
   * @security This uses `bypassSecurityTrustHtml` to allow interactive elements
   * in rendered code blocks. This is safe when content comes from trusted sources.
   */
  protected readonly renderedHtml = signal<SafeHtml>('');

  // ==========================================
  // Inputs
  // ==========================================

  /** The markdown content to render */
  public readonly content = input.required<string>();

  // ==========================================
  // Outputs
  // ==========================================

  /** Emitted when a code block's copy button is clicked */
  public readonly codeBlockCopy = output<string>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this._copyResetTimers.forEach((timer) => clearTimeout(timer)));

    // Re-render whenever the content changes, resolving the lazy service on demand.
    effect((onCleanup) => {
      const markdown = this.content();

      if (!markdown) {
        this.renderedHtml.set('');
        return;
      }

      let cancelled = false;
      onCleanup(() => (cancelled = true));

      this.rendererService().then((renderer) => {
        if (cancelled) return;
        const html = renderer.render(markdown);
        this.renderedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      });
    });
  }

  // ==========================================
  // Public Methods
  // ==========================================

  onHostClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.ai-code-block-copy');

    if (btn && btn.dataset['code']) {
      this.handleCopy(btn);
    }
  }

  private handleCopy(btn: HTMLButtonElement): void {
    const code = decodeURIComponent(btn.dataset['code']!);
    const copyIcon = btn.querySelector('.copy-icon');
    const checkIcon = btn.querySelector('.check-icon');

    navigator.clipboard.writeText(code).then(() => {
      this.codeBlockCopy.emit(code);

      copyIcon?.classList.add('hidden');
      checkIcon?.classList.remove('hidden');
      btn.classList.add('bg-zinc-700/50');

      const timer = setTimeout(() => {
        copyIcon?.classList.remove('hidden');
        checkIcon?.classList.add('hidden');
        btn.classList.remove('bg-zinc-700/50');
        this._copyResetTimers.delete(timer);
      }, 2000);
      this._copyResetTimers.add(timer);
    });
  }
}
