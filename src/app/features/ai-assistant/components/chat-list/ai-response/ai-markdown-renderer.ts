import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { DOMPurify as DOMPurifyType } from 'dompurify';
import hljs from 'highlight.js';
import { Marked, Renderer } from 'marked';

@Component({
  selector: 'adm-ai-markdown-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
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

  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);

  // ==========================================
  // State
  // ==========================================

  private marked: Marked;
  private purify: DOMPurifyType | null = null;

  private readonly COPY_ICON_SVG = `<svg class="copy-icon h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
</svg>`;

  private readonly CHECK_ICON_SVG = `<svg class="check-icon hidden h-3.5 w-3.5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`;

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

  /**
   * Rendered HTML from markdown.
   *
   * @security This uses `bypassSecurityTrustHtml` to allow interactive elements
   * in rendered code blocks. This is safe when content comes from trusted sources.
   */
  protected readonly renderedHtml = computed((): SafeHtml => {
    const markdown = this.content();
    if (!markdown) return '';

    const html = this.parseMarkdown(markdown);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  constructor() {
    // Configure marked with custom renderer
    const renderer = new Renderer();

    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
      const language = lang || 'plaintext';
      const encodedCode = encodeURIComponent(text);

      // Highlight the code
      let highlighted: string;
      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(text, { language: lang }).value;
      } else {
        highlighted = hljs.highlightAuto(text).value;
      }

      return `<div class="not-prose group/code my-4 overflow-hidden rounded-lg ">
        <div class="flex items-center justify-between bg-zinc-800 px-4 py-2">
          <span class="text-xs text-zinc-300">${language}</span>
         <button
          class="ai-code-block-copy flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-zinc-700 hover:text-zinc-100 active:scale-95"
          data-code="${encodedCode}"
          title="Copy code"
        >
         ${this.COPY_ICON_SVG}
         ${this.CHECK_ICON_SVG}
        </button>
        </div>
        <pre><code class="hljs language-${language} text-sm">${highlighted}</code></pre>
      </div>`;
    };

    this.marked = new Marked({
      renderer,
      gfm: true,
      breaks: true,
    });

    // Load DOMPurify only in browser
    if (isPlatformBrowser(this.platformId)) {
      import('dompurify').then((module) => {
        this.purify = module.default;
      });
    }
  }

  // ==========================================
  // Private Methods
  // ==========================================

  /** Parse markdown to HTML with syntax highlighting */
  private parseMarkdown(markdown: string): string {
    if (!markdown) return '';

    try {
      const html = this.marked.parse(markdown) as string;
      return this.sanitize(html);
    } catch {
      return this.sanitize(markdown);
    }
  }

  /** Sanitize HTML content using DOMPurify */
  private sanitize(html: string): string {
    if (this.purify) {
      return this.purify.sanitize(html, {
        USE_PROFILES: { html: true, svg: true },
        ADD_ATTR: [
          'class',
          'data-code',
          'title',
          'viewBox',
          'fill',
          'stroke',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
          'points',
          'x',
          'y',
          'width',
          'height',
          'rx',
          'ry',
          'd',
        ],
        ADD_TAGS: ['hlm-icon', 'ng-icon'],
      });
    }
    return html;
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

      setTimeout(() => {
        copyIcon?.classList.remove('hidden');
        checkIcon?.classList.add('hidden');
        btn.classList.remove('bg-zinc-700/50');
      }, 2000);
    });
  }
}
