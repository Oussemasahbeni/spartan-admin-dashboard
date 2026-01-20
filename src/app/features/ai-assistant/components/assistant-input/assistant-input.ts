import { ChangeDetectionStrategy, Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAppWindow,
  lucideArrowUp,
  lucideBrainCircuit,
  lucideChevronDown,
  lucideGlobe,
  lucideGraduationCap,
  lucideLightbulb,
  lucideMic,
  lucideMoreHorizontal,
  lucidePaperclip,
  lucidePencilRuler,
  lucidePlus,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { AttachmentCard } from '../attachment-card/attachment-card';

@Component({
  selector: 'adm-assistant-input',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    HlmInputImports,
    HlmInputGroupImports,
    AttachmentCard,
    TranslocoModule,
    FormField,
  ],
  templateUrl: './assistant-input.html',
  providers: [
    provideIcons({
      lucideArrowUp,
      lucideMic,
      lucidePaperclip,
      lucideChevronDown,
      lucidePlus,
      lucideGlobe,
      lucideBrainCircuit,
      lucideLightbulb,
      lucideMoreHorizontal,
      lucideAppWindow,
      lucideGraduationCap,
      lucidePencilRuler,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantInput {
  private readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly disabled = input<boolean>(false);
  readonly suggestions = input<string[]>([]);
  readonly messageSend = output<string>();
  readonly inputCleared = output<void>();

  readonly attachments = signal<File[]>([]);
  readonly models = signal<string[]>([
    'Claude Opus 4.5',
    'Claude Sonnet 4.5',
    'Claude Sonnet 4.0',
    'GPT-5.2',
    'GPT-3.5 Turbo',
    'Gemini 3.0 Pro',
  ]);
  readonly selectedModel = signal<string>(this.models()[0]);
  readonly hasAttachments = computed(() => this.attachments().length > 0);

  readonly enableWebSearch = signal(false);
  readonly enableReasoning = signal(false);
  readonly enableThinking = signal(false);

  readonly isRecording = signal(false);

  readonly canSend = computed(() => this.promptForm.prompt().value().trim().length > 0 || this.hasAttachments());

  readonly promptModel = signal({ prompt: '' });

  readonly promptForm = form(this.promptModel);

  toggleMic() {
    this.isRecording.set(!this.isRecording());
  }

  handleSend() {
    if (this.canSend()) {
      this.messageSend.emit(this.promptForm.prompt().value());
      this.promptForm.prompt().value.set('');
    }
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const files = Array.from(input.files);
      // Add to attachments
      this.attachments.update((current) => [...current, ...files]);
      // Reset input so same file can be selected again
      input.value = '';
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    // Enter without Shift sends the message
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
    // Escape clears the input
    if (event.key === 'Escape') {
      this.handleClear();
    }
  }

  triggerFileInput(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  removeAttachment(fileToRemove: File): void {
    const updatedAttachments = this.attachments().filter((file) => file !== fileToRemove);
    this.attachments.set(updatedAttachments);
  }

  selectModel(model: string): void {
    this.selectedModel.set(model);
  }

  handleClear(): void {
    this.promptForm.prompt().value.set('');
    this.inputCleared.emit();
  }
}
