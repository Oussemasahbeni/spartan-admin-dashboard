// import { NgIcon, provideIcons } from '@ng-icons/core';
// import { lucideSparkle } from '@ng-icons/lucide';
// import { cn } from '@angular-ai-kit/utils';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   ViewEncapsulation,
//   computed,
//   input,
//   output,
//   signal,
// } from '@angular/core';
// import { HlmAvatar, HlmAvatarFallback } from '../../../spartan-ui/avatar';
// import { HlmIcon } from '../../../spartan-ui/icon';
// import { MarkdownRendererComponent } from '../markdown-renderer';
// import { ResponseActionsComponent } from '../response-actions';

// /**
//  * AI Response Component
//  *
//  * Displays AI response content with markdown rendering, syntax highlighting,
//  * streaming cursor, and action buttons. Uses MarkdownRenderer and ResponseActions
//  * sub-components for a clean, composable architecture.
//  *
//  * Features:
//  * - Full markdown support (GFM) via MarkdownRenderer
//  * - Code blocks with syntax highlighting
//  * - Copy button on each code block
//  * - Streaming cursor indicator
//  * - Action buttons: copy, regenerate, thumbs up/down via ResponseActions
//  *
//  * @example
//  * ```html
//  * <ai-response
//  *   [content]="response"
//  *   [isStreaming]="isLoading"
//  *   (copy)="handleCopy($event)"
//  *   (regenerate)="handleRegenerate()"
//  *   (thumbsUp)="handleThumbsUp()"
//  *   (thumbsDown)="handleThumbsDown()"
//  * />
//  * ```
//  */
// @Component({
//   selector: 'ai-response',
//   templateUrl: './ai-response.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   imports: [
//     MarkdownRendererComponent,
//     ResponseActionsComponent,
//     HlmAvatar,
//     HlmAvatarFallback,
//     HlmIcon,
//     NgIcon,
//   ],
//   viewProviders: [provideIcons({ lucideSparkle })],
//   host: {
//     class: 'ai-response-host block',
//     '[attr.aria-live]': '"polite"',
//     '[attr.aria-busy]': 'isStreaming()',
//     '(mouseenter)': 'handleMouseEnter()',
//     '(mouseleave)': 'handleMouseLeave()',
//     '(focusin)': 'handleFocusIn()',
//     '(focusout)': 'handleFocusOut()',
//   },
// })
// export class AiResponseComponent {
//   // ==========================================
//   // Inputs
//   // ==========================================

//   /** The markdown content to display */
//   content = input.required<string>();

//   /** Whether the content is currently streaming */
//   isStreaming = input<boolean>(false);

//   /** Whether to show action buttons */
//   showActions = input<boolean>(true);

//   /** Whether to show the streaming cursor */
//   showCursor = input<boolean>(true);

//   /** Whether to show the copy button */
//   showCopy = input<boolean>(true);

//   /** Whether to show the regenerate button */
//   showRegenerate = input<boolean>(true);

//   /** Whether to show feedback buttons */
//   showFeedback = input<boolean>(true);

//   /** Whether actions are always visible (vs hover/focus) */
//   actionsAlwaysVisible = input<boolean>(false);

//   /** Whether to show an avatar */
//   showAvatar = input<boolean>(false);

//   /** Custom CSS classes */
//   customClasses = input<string>('');

//   // ==========================================
//   // Outputs
//   // ==========================================

//   /** Emitted when copy button is clicked with full content */
//   copy = output<string>();

//   /** Emitted when a code block is copied */
//   codeBlockCopy = output<string>();

//   /** Emitted when regenerate button is clicked */
//   regenerate = output<void>();

//   /** Emitted when thumbs up is clicked */
//   thumbsUp = output<void>();

//   /** Emitted when thumbs down is clicked */
//   thumbsDown = output<void>();

//   // ==========================================
//   // State
//   // ==========================================

//   private _isHovered = signal(false);
//   isHovered = this._isHovered.asReadonly();

//   private _isFocused = signal(false);
//   isFocused = this._isFocused.asReadonly();

//   // ==========================================
//   // Computed Properties
//   // ==========================================

//   /** Container classes */
//   containerClasses = computed(() =>
//     cn(
//       'ai-response relative',
//       { 'flex gap-3': this.showAvatar() },
//       this.customClasses()
//     )
//   );

//   /** Avatar classes */
//   avatarClasses = computed(() => cn('ai-response-avatar shrink-0'));

//   /** Content wrapper classes */
//   contentClasses = computed(() =>
//     cn('ai-response-content text-sm leading-relaxed text-foreground')
//   );

//   /** Cursor classes */
//   cursorClasses = computed(() =>
//     cn('ai-response-cursor inline-block ml-0.5 text-foreground animate-pulse')
//   );

//   /** Actions wrapper classes */
//   actionsWrapperClasses = computed(() => cn('mt-2'));

//   // ==========================================
//   // Event Handlers
//   // ==========================================

//   /** Handle copy from ResponseActions */
//   handleCopy(content: string): void {
//     this.copy.emit(content);
//   }

//   /** Handle code block copy from MarkdownRenderer */
//   handleCodeBlockCopy(code: string): void {
//     this.codeBlockCopy.emit(code);
//   }

//   /** Handle regenerate from ResponseActions */
//   handleRegenerate(): void {
//     this.regenerate.emit();
//   }

//   /** Handle thumbs up from ResponseActions */
//   handleThumbsUp(): void {
//     this.thumbsUp.emit();
//   }

//   /** Handle thumbs down from ResponseActions */
//   handleThumbsDown(): void {
//     this.thumbsDown.emit();
//   }

//   /** Handle mouse enter */
//   handleMouseEnter(): void {
//     this._isHovered.set(true);
//   }

//   /** Handle mouse leave */
//   handleMouseLeave(): void {
//     this._isHovered.set(false);
//   }

//   /** Handle focus in */
//   handleFocusIn(): void {
//     this._isFocused.set(true);
//   }

//   /** Handle focus out */
//   handleFocusOut(): void {
//     this._isFocused.set(false);
//   }
// }
