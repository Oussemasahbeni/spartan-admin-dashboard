// import { NgIcon, provideIcons } from '@ng-icons/core';
// import { lucideUser } from '@ng-icons/lucide';
// import { cn } from '@angular-ai-kit/utils';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   ElementRef,
//   ViewEncapsulation,
//   computed,
//   input,
//   output,
//   signal,
//   viewChild,
// } from '@angular/core';
// import { HlmAvatar, HlmAvatarFallback } from '../../../spartan-ui/avatar';
// import { HlmIcon } from '../../../spartan-ui/icon';
// import { UserMessage } from '../../../types';
// import { MessageActionsComponent } from '../message-actions';
// import { EditEvent } from './user-message.types';

// /**
//  * User Message Component
//  *
//  * Displays user chat messages with a compact card style, hover actions,
//  * inline editing, and text truncation with "show more" functionality.
//  * Uses MessageActions sub-component for copy/edit buttons.
//  *
//  * Features:
//  * - Compact card (not full-width), right-aligned
//  * - Optional avatar (hidden by default, controlled via showAvatar)
//  * - Copy and Edit buttons via MessageActions on hover
//  * - Inline editing with Save/Cancel
//  * - Truncation with "Show more/less" for long messages
//  *
//  * @example
//  * ```html
//  * <ai-user-message
//  *   [message]="userMessage"
//  *   [showAvatar]="true"
//  *   (copy)="handleCopy($event)"
//  *   (edit)="handleEdit($event)"
//  * />
//  * ```
//  */
// @Component({
//   selector: 'ai-user-message',
//   templateUrl: './user-message.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   imports: [
//     MessageActionsComponent,
//     HlmAvatar,
//     HlmAvatarFallback,
//     HlmIcon,
//     NgIcon,
//   ],
//   viewProviders: [provideIcons({ lucideUser })],
//   host: {
//     class: 'ai-user-message-host block',
//     '(mouseenter)': 'handleMouseEnter()',
//     '(mouseleave)': 'handleMouseLeave()',
//     '(focusin)': 'handleFocusIn()',
//     '(focusout)': 'handleFocusOut()',
//   },
// })
// export class UserMessageComponent {
//   // View children
//   private editTextarea =
//     viewChild<ElementRef<HTMLTextAreaElement>>('editTextarea');

//   // ==========================================
//   // Inputs
//   // ==========================================

//   /** The user message to display */
//   message = input.required<UserMessage>();

//   /** Maximum characters before truncation */
//   maxChars = input<number>(200);

//   /** Whether to show the copy button */
//   showCopy = input<boolean>(true);

//   /** Whether to show the edit button */
//   showEdit = input<boolean>(true);

//   /** Whether to show an avatar */
//   showAvatar = input<boolean>(false);

//   /** Custom CSS classes */
//   customClasses = input<string>('');

//   // ==========================================
//   // Outputs
//   // ==========================================

//   /** Emitted when copy button is clicked with message content */
//   copy = output<string>();

//   /** Emitted when message is edited and saved */
//   edit = output<EditEvent>();

//   // ==========================================
//   // Internal State
//   // ==========================================

//   private _isHovered = signal(false);
//   private _isFocused = signal(false);
//   private _isExpanded = signal(false);
//   private _isEditing = signal(false);
//   private _editContent = signal('');

//   // Readonly signals for template
//   isHovered = this._isHovered.asReadonly();
//   isFocused = this._isFocused.asReadonly();
//   isExpanded = this._isExpanded.asReadonly();
//   isEditing = this._isEditing.asReadonly();
//   editContent = this._editContent.asReadonly();

//   // ==========================================
//   // Computed Properties
//   // ==========================================

//   /** Whether actions should be visible (on hover or focus) */
//   actionsVisible = computed(() => this._isHovered() || this._isFocused());

//   /** Whether the message exceeds maxChars */
//   isLongMessage = computed(() => {
//     const content = this.message().content;
//     return content.length > this.maxChars();
//   });

//   /** Whether the message is short (for pill-like styling) */
//   isShortMessage = computed(() => {
//     const content = this.message().content;
//     return content.length < 50 && !content.includes('\n');
//   });

//   /** The content to display (truncated or full) */
//   displayContent = computed(() => {
//     const content = this.message().content;
//     if (this._isExpanded() || !this.isLongMessage()) {
//       return content;
//     }
//     return content.substring(0, this.maxChars()) + '...';
//   });

//   /** ARIA label for screen readers */
//   ariaLabel = computed(() => {
//     const content = this.message().content;
//     const preview = content.substring(0, 100);
//     return `Your message: ${preview}${content.length > 100 ? '...' : ''}`;
//   });

//   /** Container classes (right-aligned wrapper) */
//   containerClasses = computed(() =>
//     cn(
//       'ai-user-message',
//       'group',
//       this.showAvatar()
//         ? 'flex flex-row-reverse gap-3 items-start'
//         : 'flex flex-col items-end',
//       this.customClasses()
//     )
//   );

//   /** Avatar classes */
//   avatarClasses = computed(() => cn('ai-user-message-avatar shrink-0'));

//   /** Card classes (the message bubble) */
//   cardClasses = computed(() =>
//     cn(
//       'ai-user-message-card',
//       'inline-block max-w-[80%]',
//       'px-4 py-3',
//       'bg-message-user-bg',
//       'text-foreground',
//       'shadow-sm',
//       'transition-all duration-200',
//       'rounded-xl'
//     )
//   );

//   /** Content classes */
//   contentClasses = computed(() =>
//     cn(
//       'ai-user-message-content',
//       'text-sm leading-relaxed',
//       'whitespace-pre-wrap break-words'
//     )
//   );

//   /** Actions wrapper classes */
//   actionsWrapperClasses = computed(() => cn('mt-1.5'));

//   /** Textarea classes for edit mode */
//   textareaClasses = computed(() =>
//     cn(
//       'w-full',
//       'bg-transparent',
//       'border-none',
//       'focus:outline-none focus:ring-0',
//       'resize-none',
//       'text-sm leading-relaxed'
//     )
//   );

//   // ==========================================
//   // Methods
//   // ==========================================

//   /** Toggle expanded/collapsed state */
//   toggleExpand(): void {
//     this._isExpanded.update((v) => !v);
//   }

//   /** Handle copy from MessageActions */
//   handleCopy(): void {
//     this.copy.emit(this.message().content);
//   }

//   /** Start editing mode */
//   startEdit(): void {
//     this._editContent.set(this.message().content);
//     this._isEditing.set(true);
//     // Focus textarea after render
//     setTimeout(() => {
//       const textarea = this.editTextarea()?.nativeElement;
//       if (textarea) {
//         textarea.focus();
//         textarea.setSelectionRange(
//           textarea.value.length,
//           textarea.value.length
//         );
//       }
//     }, 0);
//   }

//   /** Cancel editing */
//   cancelEdit(): void {
//     this._isEditing.set(false);
//     this._editContent.set('');
//   }

//   /** Save edited content */
//   saveEdit(): void {
//     const newContent = this._editContent().trim();
//     const originalContent = this.message().content;

//     if (newContent && newContent !== originalContent) {
//       this.edit.emit({
//         originalContent,
//         newContent,
//       });
//     }
//     this._isEditing.set(false);
//     this._editContent.set('');
//   }

//   /** Handle textarea input */
//   handleEditInput(event: Event): void {
//     const target = event.target as HTMLTextAreaElement;
//     this._editContent.set(target.value);
//   }

//   /** Handle keyboard events in edit mode */
//   handleEditKeydown(event: KeyboardEvent): void {
//     if (event.key === 'Escape') {
//       event.preventDefault();
//       this.cancelEdit();
//     } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
//       event.preventDefault();
//       this.saveEdit();
//     }
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
