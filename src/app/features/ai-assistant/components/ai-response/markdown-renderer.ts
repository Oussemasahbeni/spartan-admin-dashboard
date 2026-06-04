import { Service } from '@angular/core';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { Marked, Renderer } from 'marked';

/**
 * Wraps the heavy markdown stack (`marked`, `highlight.js`, `dompurify`) behind a
 * single service so it can be lazy-loaded with `injectAsync`. None of these
 * libraries are pulled into the initial bundle — they only download the first time
 * an AI response actually needs to be rendered.
 */
@Service()
export default class MarkdownRendererService {
  private marked: Marked;

  private readonly COPY_ICON_SVG = `<svg class="copy-icon size-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
</svg>`;

  private readonly CHECK_ICON_SVG = `<svg class="check-icon hidden size-3.5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`;

  constructor() {
    // Configure marked with a custom renderer for highlighted, copyable code blocks.
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
  }

  /** Parse markdown to sanitized HTML with syntax highlighting. */
  render(markdown: string): string {
    if (!markdown) return '';

    try {
      const html = this.marked.parse(markdown) as string;
      return this.sanitize(html);
    } catch {
      return this.sanitize(markdown);
    }
  }

  /** Sanitize HTML content using DOMPurify. */
  private sanitize(html: string): string {
    return DOMPurify.sanitize(html, {
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
}
